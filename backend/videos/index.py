import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления видео на телеканале
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с attributes: request_id, function_name
    Returns: HTTP response dict с видео из базы данных
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            video_id = query_params.get('id')
            
            if video_id:
                cursor.execute('SELECT * FROM videos WHERE id = %s', (video_id,))
                video = cursor.fetchone()
                result = dict(video) if video else None
            else:
                cursor.execute('SELECT * FROM videos ORDER BY created_at DESC')
                videos = cursor.fetchall()
                result = [dict(row) for row in videos]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute('''
                INSERT INTO videos (title, artist, video_url, thumbnail_url, duration, category, is_live)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, title, artist, video_url, thumbnail_url, duration, category, views, is_live, created_at
            ''', (
                body_data.get('title'),
                body_data.get('artist'),
                body_data.get('video_url'),
                body_data.get('thumbnail_url'),
                body_data.get('duration'),
                body_data.get('category'),
                body_data.get('is_live', False)
            ))
            
            new_video = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_video), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            video_id = body_data.get('id')
            
            cursor.execute('''
                UPDATE videos 
                SET title=%s, artist=%s, video_url=%s, thumbnail_url=%s, duration=%s, category=%s, is_live=%s, updated_at=CURRENT_TIMESTAMP
                WHERE id=%s
                RETURNING id, title, artist, video_url, thumbnail_url, duration, category, views, is_live, updated_at
            ''', (
                body_data.get('title'),
                body_data.get('artist'),
                body_data.get('video_url'),
                body_data.get('thumbnail_url'),
                body_data.get('duration'),
                body_data.get('category'),
                body_data.get('is_live', False),
                video_id
            ))
            
            updated_video = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_video) if updated_video else None, default=str),
                'isBase64Encoded': False
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
