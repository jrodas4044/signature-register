This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SCA-Political (Sistema de Control de Adhesiones y KPIs)

### Base de datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com) y configura las variables en `.env` (ver `.env.example`).
2. Ejecuta las migraciones en el SQL Editor del dashboard, en este orden:
   - `supabase/migrations/20260201000000_initial_schema.sql`
   - `supabase/migrations/20260201000001_rls_and_policies.sql`
3. Si el trigger `on_auth_user_created` en `auth.users` falla por permisos, crea el perfil manualmente al registrar el primer usuario: en la tabla `public.profiles` inserta una fila con `user_id` = UUID del usuario en Auth y `role` = `administrador`.
4. Para probar por rol: en `profiles` asigna `administrador`, `digitador` o `auditor`. Solo administrador puede asignar hojas y recepción; digitador y administrador pueden digitación e importar CSV; todos pueden ver el dashboard.

### Módulos

- **Dashboard** (`/admin`): Top Performers y Alertas de fraude.
- **Inventario** (`/admin/inventario`): Asignación masiva y recepción.
- **Digitación** (`/admin/digitacion`): Speed-Type y **Importar TSE** (`/admin/digitacion/importar`) para CSV.

Crea al menos un líder en la tabla `lideres` (por SQL o la pantalla Líderes en `/admin/lideres`) para poder asignar hojas.

### Migrar CSV "Base de datos General"

Para cargar el CSV de estadísticas en Supabase (normaliza líderes, hojas y adhesiones):

1. Añade en `.env`: `SUPABASE_URL` (o usa `NEXT_PUBLIC_SUPABASE_URL`) y `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API; **no** la anon key).
2. Ejecuta: `npm run migrate:csv` (o `npx ts-node scripts/migrate-csv-to-supabase.ts`).
3. Opcional: `--dry-run` para solo mostrar conteos sin escribir; `--file=ruta.csv` para otro archivo.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# signature-register
