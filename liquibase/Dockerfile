FROM liquibase/liquibase:4.24

WORKDIR /liquibase

COPY changelogs ./changelogs
COPY liquibase.properties .

ENTRYPOINT ["liquibase"]
CMD ["update"]