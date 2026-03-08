

## Plan: Tilldela admin-roll till ditt konto

Ditt konto har hittats med user_id `f6817cde-7799-49fe-922f-de6cac3c370f`.

### Åtgärd

Köra en databasmigration som infogar en rad i `user_roles`-tabellen:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('f6817cde-7799-49fe-922f-de6cac3c370f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

En migration krävs eftersom RLS-policyn på `user_roles` kräver att en admin redan finns för att kunna infoga nya roller — ett "hönan eller ägget"-problem för den första adminen.

### Resultat

Efter detta kan du logga in på `/auth` med `tobiasssandberg@gmail.com` och få full tillgång till admin-panelen på `/admin`.

