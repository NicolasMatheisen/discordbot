export const name = 'ready';
export const once = true;
export function execute(client) {
  console.log(`✔️ Eingeloggt als ${client.user.tag}`);
}
