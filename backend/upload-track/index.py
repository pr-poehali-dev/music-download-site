import json
import os
import uuid
import base64
import psycopg2
import boto3

def handler(event: dict, context) -> dict:
    """Загрузка аудиофайла трека и обложки в S3, сохранение метаданных в БД."""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    title = body.get('title', '').strip()
    album = body.get('album', '').strip()
    genre = body.get('genre', '').strip()
    duration = body.get('duration', '').strip()
    year = body.get('year')
    sort_order = body.get('sort_order', 0)
    audio_b64 = body.get('audio_b64')
    audio_filename = body.get('audio_filename', 'track.mp3')
    cover_b64 = body.get('cover_b64')
    cover_filename = body.get('cover_filename', 'cover.jpg')

    if not title or not audio_b64:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'title и audio_b64 обязательны'})}

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    project_id = os.environ['AWS_ACCESS_KEY_ID']

    # Upload audio
    audio_ext = audio_filename.rsplit('.', 1)[-1].lower()
    audio_key = f"music/audio/{uuid.uuid4()}.{audio_ext}"
    audio_data = base64.b64decode(audio_b64)
    content_type = 'audio/mpeg' if audio_ext == 'mp3' else f'audio/{audio_ext}'
    s3.put_object(Bucket='files', Key=audio_key, Body=audio_data, ContentType=content_type)
    audio_url = f"https://cdn.poehali.dev/projects/{project_id}/files/{audio_key}"

    # Upload cover (optional)
    cover_url = None
    if cover_b64:
        cover_ext = cover_filename.rsplit('.', 1)[-1].lower()
        cover_key = f"music/covers/{uuid.uuid4()}.{cover_ext}"
        cover_data = base64.b64decode(cover_b64)
        s3.put_object(Bucket='files', Key=cover_key, Body=cover_data, ContentType=f'image/{cover_ext}')
        cover_url = f"https://cdn.poehali.dev/projects/{project_id}/files/{cover_key}"

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p36769415_music_download_site')
    cur.execute(
        f"""INSERT INTO {schema}.tracks (title, album, genre, duration, cover_url, audio_url, year, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (title, album, genre, duration, cover_url, audio_url, year, sort_order)
    )
    track_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'id': track_id, 'audio_url': audio_url, 'cover_url': cover_url})
    }
