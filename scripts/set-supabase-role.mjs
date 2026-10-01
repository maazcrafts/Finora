import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({ credential: applicationDefault() });

const auth = getAuth();

async function main() {
  let pageToken;
  let count = 0;

  do {
    const page = await auth.listUsers(1000, pageToken);

    await Promise.all(
      page.users.map(async (user) => {
        const existing = user.customClaims ?? {};
        if (existing.role === 'authenticated') return;

        await auth.setCustomUserClaims(user.uid, {
          ...existing,
          role: 'authenticated',
        });
        count += 1;
      }),
    );

    pageToken = page.pageToken;
  } while (pageToken);

  console.log(`Updated ${count} Firebase users with role=authenticated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
