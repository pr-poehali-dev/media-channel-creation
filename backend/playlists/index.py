import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с плейлистами телеканала
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с attributes: request_id, function_name
    Returns: HTTP response dict с плейлистами и видео
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
            playlist_id = query_params.get('id')
            
            if playlist_id:
                cursor.execute('''
                    SELECT p.*, COUNT(pv.video_id) as video_count
                    FROM playlists p
                    LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
                    WHERE p.id = %s
                    GROUP BY p.id
                ''', (playlist_id,))
                playlist = cursor.fetchone()
                
                if playlist:
                    cursor.execute('''
                        SELECT v.* FROM videos v
                        JOIN playlist_videos pv ON v.id = pv.video_id
                        WHERE pv.playlist_id = %s
                        ORDER BY pv.position
                    ''', (playlist_id,))
                    videos = cursor.fetchall()
                    result = dict(playlist)
                    result['videos'] = [dict(row) for row in videos]
                else:
                    result = None
            else:
                cursor.execute('''
                    SELECT p.*, COUNT(pv.video_id) as video_count
                    FROM playlists p
                    LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
                    GROUP BY p.id
                    ORDER BY p.created_at DESC
                ''')
                playlists = cursor.fetchall()
                result = [dict(row) for row in playlists]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
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
