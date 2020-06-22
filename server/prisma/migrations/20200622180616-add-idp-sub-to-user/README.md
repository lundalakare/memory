# Migration `20200622180616-add-idp-sub-to-user`

This migration has been generated by Malcolm Nihlén at 6/22/2020, 6:06:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "idpSub" text   ,
ALTER COLUMN "role" SET DEFAULT E'USER';

CREATE UNIQUE INDEX "User.idpSub" ON "public"."User"("idpSub")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200622173805-remove-props-from-user..20200622180616-add-idp-sub-to-user
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
@@ -17,8 +17,9 @@
 model User {
   id        String      @id @default(cuid())
   role      Role        @default(USER)
+  idpSub    String?     @unique
   decks     Deck[]
   noteTypes NoteType[]
   createdAt DateTime    @default(now())
   updatedAt DateTime    @updatedAt()
```

