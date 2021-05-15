#test
curl -X POST https://fax.twilio.com/v1/Faxes \
--data-urlencode "From=+16502404422" \
--data-urlencode "To=+14153588666" \
--data-urlencode "MediaUrl=https://www.twilio.com/docs/documents/25/justthefaxmaam.pdf" \
-u ACc3690e337cda876fa995ceb161e49634:cb886ddb7a309a4522b1eab127fd5a21

#real
curl -X POST https://fax.twilio.com/v1/Faxes \
--data-urlencode "From=+16502404422" \
--data-urlencode "To=+14153588666" \
--data-urlencode "MediaUrl=https://www.twilio.com/docs/documents/25/justthefaxmaam.pdf" \
-u ACcdb9de39582e16f357b05e7a6e409d0f:0ef42bc403702cb06c0b350b364c0e2d



