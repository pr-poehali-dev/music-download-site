import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Возвращает список всех треков из БД."""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p36769415_music_download_site')
    cur.execute(
        f"""SELECT id, title, album, genre, duration, cover_url, audio_url, year, sort_order
            FROM {schema}.tracks
            ORDER BY sort_order ASC, id ASC"""
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    tracks = [
        {
            'id': r[0],
            'title': r[1],
            'album': r[2],
            'genre': r[3],
            'duration': r[4],
            'cover_url': r[5],
            'audio_url': r[6],
            'year': r[7],
            'sort_order': r[8],
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'tracks': tracks})
    }
