# Musical App

Django + Next.js + TypeScript + Tailwind CSSで構築されたフルスタックアプリケーション

## 技術スタック

### バックエンド
- Django 5.0
- Django REST Framework
- PostgreSQL
- JWT認証

### フロントエンド
- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

## セットアップ

### 前提条件
- Docker
- Docker Compose

### 起動方法

1. リポジトリをクローン
```bash
git clone <repository-url>
cd musical
```

2. Docker Composeでサービスを起動
```bash
make build
```

または

```bash
docker-compose up -d --build
```

3. アプリケーションにアクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

### 便利なMakeコマンド

```bash
make up        # サービスを起動
make down      # サービスを停止
make build     # ビルドして起動
make logs      # 全サービスのログを表示
make backend   # バックエンドのログを表示
make frontend  # フロントエンドのログを表示
make clean     # コンテナとボリュームを削除
make restart   # サービスを再起動
make db        # PostgreSQLシェルにアクセス
```

## 開発

### マイグレーション

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### スーパーユーザー作成

```bash
docker-compose exec backend python manage.py createsuperuser
```

### 依存関係の追加

#### バックエンド
```bash
# requirements.txtに追加してから
docker-compose exec backend pip install -r requirements.txt
```

#### フロントエンド
```bash
# package.jsonに追加してから
docker-compose exec frontend npm install
```

## APIエンドポイント

- `GET /api/health/` - ヘルスチェック

## ライセンス

MIT
