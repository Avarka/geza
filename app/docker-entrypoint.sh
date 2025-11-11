#!/bin/sh

echo "Waiting for MySQL..."
while ! mysql -h db -u $MYSQL_USER -p$MYSQL_PASSWORD -e "select 1" $MYSQL_DATABASE --ssl-verify-server-cert=off >/dev/null 2>&1; do
  echo "  MySQL is unavailable - sleeping"
  sleep 1
done

echo "MySQL is up - running migrations..."

pnpm run drizzle:push

if [ $? -ne 0 ]; then
  echo "Migrations failed!"
  exit 1
fi

echo "Migrations complete."
echo "Addig dummy data..."

sed -i 's/h270402/'$TEACHER_SAMPLE_UIDS'/g' ./GEZA_teacher_courses.sql
mysql -h db -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE --ssl-verify-server-cert=off < ./GEZA_teacher_courses.sql

echo "Dummy data added."

echo "Starting application..."

exec "$@"