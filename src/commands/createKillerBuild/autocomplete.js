import killers   from '../../data/killers.json'   assert { type: 'json' };
import perks     from '../../data/perks.json'     assert { type: 'json' };
import addons    from '../../data/addons.json'    assert { type: 'json' };
import offerings from '../../data/offerings.json' assert { type: 'json' };

const dataMap = {
  killer:   killers,
  perk1:    perks, perk2: perks, perk3: perks, perk4: perks,
  addon1:   addons, addon2: addons,
  offering: offerings
};

export async function autocomplete(interaction) {
  const focused = interaction.options.getFocused(true);
  const list = dataMap[focused.name] || [];
  const choices = list
    .filter(item => item.toLowerCase().includes(focused.value.toLowerCase()))
    .slice(0, 25)
    .map(item => ({ name: item, value: item }));

  await interaction.respond(choices);
}
