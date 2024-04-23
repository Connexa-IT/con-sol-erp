source .env

WIDGETS_DTS=$(cat src/MyWidgets/d.ts | grep -v '^import ' | jq -sRr @json)
WIDGETS_SCRIPT=$(cat src/MyWidgets/script.js | grep -v '^import ' | jq -sRr @json) 

status_code=$(curl --include --write-out %{http_code} --silent --output /dev/null -X PATCH -H "content-type: application/json" -H "Authorization: Bearer $TOKEN" --data "{ \"fields\": { \"script\": { \"runableSript\" : $WIDGETS_SCRIPT }, \"dts\": { \"writtenTypeScript\" : $WIDGETS_DTS } } } }" "https://app.tabidoo.cloud/api/v2/apps/$APP_ID/tables/$TABLE_ID/data/$RECORD_ID")

if [[ "$status_code" -ne 200 ]] ; then
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Widgets failed, response code [$status_code]"
  exit 1
else
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Widgets updated"
  exit 0
fi