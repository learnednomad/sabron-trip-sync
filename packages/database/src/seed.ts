// import { supabase } from './index';
// import { faker } from '@faker-js/faker';

function seed() {
  // eslint-disable-next-line no-console
  console.log('Seeding functionality needs to be reimplemented for Supabase');
  // eslint-disable-next-line no-console
  console.log('For now, this is a placeholder. Manual seeding via Supabase dashboard is recommended.');
  
  // TODO: Reimplement seeding using Supabase client instead of Prisma
  // Example structure for future implementation:
  /*
  // Clean existing data
  await supabase.from('users').delete().neq('id', 0);
  await supabase.from('itineraries').delete().neq('id', 0);

  // Create users with Supabase Auth
  // Create user profiles and preferences
  // Create sample itineraries
  */
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    // eslint-disable-next-line no-console
    console.log('Seed process completed');
  });
