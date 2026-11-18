// Healthy Range — the thirteen cookies the client listed on 17 Nov 2026, in their order. The names match the
// pouches in the product photos (tools/process_healthy_range.py). This range is not in the catalogue PDF, so
// only names and photos are shown: no pack sizes, ingredients, prices or health claims until the client
// supplies them.
// Each cookie has a packshot (`pack`) and a lifestyle scene (`scene`); both are illustrative.

const cookie = (id, name, packAlt, sceneAlt) => ({
  id,
  name,
  pack: `healthy/${id}-pack`,
  scene: `healthy/${id}-scene`,
  packAlt: `Anai ${name} pouch from the Healthy Range, ${packAlt}`,
  sceneAlt,
})

export const healthyRange = [
  cookie(
    'gud-chana',
    'Gud Chana Cookies',
    'with a stack of cookies, a bowl of roasted chana and a piece of jaggery',
    'A hand dipping a Gud Chana cookie into a cup of chai, with the Anai pouch and a bowl of roasted chana behind',
  ),
  cookie(
    'multigrain',
    'Multigrain Cookies',
    'with a stack of cookies and scoops of seeds and grains',
    'Anai Multigrain Cookies pouch on linen, surrounded by cookies, wheat ears and bowls of grains and seeds',
  ),
  cookie(
    'atta',
    'Atta Cookies',
    'with a stack of cookies, a bowl of flour and wheat ears',
    'Anai Atta Cookies pouch tipped on a wooden board with cookies spilling out beside a scoop of flour',
  ),
  cookie(
    'ragi',
    'Ragi Cookies',
    'with a stack of dark ragi cookies, a bowl of ragi grain and millet stalks',
    'Two hands breaking a ragi cookie in half in front of the Anai Ragi Cookies pouch',
  ),
  cookie(
    'bajra',
    'Bajra Cookies',
    'with a stack of cookies, a bowl of bajra and a millet cob',
    'Anai Bajra Cookies pouch on a work desk beside a laptop, a cup of tea and a plate of cookies',
  ),
  cookie(
    'jowar',
    'Jowar Cookies',
    'with a stack of cookies, a bowl of jowar and a sorghum stalk',
    'Anai Jowar Cookies pouch with cookies, a bowl of jowar and a steel filter-coffee tumbler',
  ),
  cookie(
    'oats',
    'Oats Cookies',
    'with a stack of cookies and a wooden scoop of oats',
    'Anai Oats Cookies pouch at breakfast with a glass of milk, sliced banana, a bowl of oats and a plate of cookies',
  ),
  cookie(
    'jaggery',
    'Jaggery Cookies',
    'with cubes of jaggery and a stack of cookies',
    'Anai Jaggery Cookies pouch on a woven table with kulhad cups of chai, a plate of cookies and a block of jaggery',
  ),
  cookie(
    'gur-atta',
    'Gur Atta Cookies',
    'with a stack of cookies, a bowl of flour and pieces of gur',
    'Anai Gur Atta Cookies pouch on a rustic table with a brass bowl of flour, gur and a steel tin of cookies',
  ),
  cookie(
    'millet',
    'Millet Cookies',
    'with a stack of cookies and small bowls of millets',
    'Anai Millet Cookies pouch ringed by bowls of different millets, cookies and leaves',
  ),
  cookie(
    'sattu',
    'Sattu Cookies',
    'with a brass bowl of sattu, roasted chana and a stack of cookies',
    'A Sattu cookie broken open on a brass plate of sattu, with roasted chana and the Anai pouch behind',
  ),
  cookie(
    'besan',
    'Besan Cookies',
    'with a stack of cookies and a bowl of besan',
    'Anai Besan Cookies pouch tied with twine among diyas, marigolds and rose petals, with a brass plate of cookies',
  ),
  cookie(
    'whole-wheat',
    'Whole Wheat Cookies',
    'with a stack of cookies and wheat ears',
    'Someone taking a cookie from an Anai Whole Wheat Cookies pouch in a canvas tote, outdoors',
  ),
]

export const healthyById = Object.fromEntries(healthyRange.map((item) => [item.id, item]))
