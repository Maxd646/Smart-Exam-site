FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/ /app/
RUN npm install && npm run build

FROM python:3.11

WORKDIR /code

COPY backend/ /code/

COPY --from=frontend-build /app/build /code/frontend_build/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN mkdir -p /code/static
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
