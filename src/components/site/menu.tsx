import { motion } from 'framer-motion';
import { Reveal, SectionHeading } from './reveal';

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: 'Coffee & Drinks',
    items: [
      { name: 'Flat White', description: 'Double shot, silky milk — the house favourite', price: '€3.80' },
      { name: 'Cappuccino', description: 'Classic, with a dusting of chocolate if you like', price: '€3.80' },
      { name: 'Batch Brew', description: 'Rotating single origin, served black', price: '€3.20' },
      { name: 'Iced Latte', description: 'Cold, creamy and dangerously easy to drink', price: '€4.20' },
      { name: 'Barry’s Tea', description: 'Properly strong, pot for one', price: '€2.80' },
      { name: 'Hot Chocolate', description: 'Real chocolate, whipped cream, marshmallows', price: '€4.00' },
    ],
  },
  {
    category: 'Brunch (until 3pm)',
    items: [
      { name: 'The Full Madden', description: 'Sausage, bacon, egg, pudding, sourdough toast & relish', price: '€13.50' },
      { name: 'Smashed Avo & Eggs', description: 'Poached eggs, chilli, lime, toasted sourdough', price: '€11.50' },
      { name: 'French Toast', description: 'Brioche, berries, maple syrup, mascarpone', price: '€10.50' },
      { name: 'Kerry Rarebit', description: 'Melted Irish cheddar, mustard & stout on sourdough', price: '€9.50' },
      { name: 'Granola Bowl', description: 'House granola, Greek yogurt, honey, seasonal fruit', price: '€7.50' },
    ],
  },
  {
    category: 'From the Bakery',
    items: [
      { name: 'Butter Croissant', description: 'Flaky, golden, gone by noon', price: '€3.20' },
      { name: 'Fruit Scone', description: 'With butter, jam & cream — the traditional way', price: '€3.50' },
      { name: 'Cinnamon Bun', description: 'Sticky, spiced and generous', price: '€3.90' },
      { name: 'Guinness Brownie', description: 'Dark, fudgy, a little bit Irish', price: '€3.80' },
    ],
  },
];

export function Menu() {
  return (
    <section id="menu" className="scroll-mt-8 bg-cream-100 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading kicker="good things to eat & drink" title="The Menu" />

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {menu.map((section, si) => (
            <Reveal key={section.category} delay={0.1 * si}>
              <h3 className="border-b-2 border-rust-600/50 pb-3 font-serif text-2xl font-semibold text-espresso-900">
                {section.category}
              </h3>
              <ul className="mt-6 space-y-5">
                {section.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className="group cursor-default transition-transform duration-300 hover:translate-x-1.5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-espresso-900 transition-colors duration-300 group-hover:text-rust-600">{item.name}</span>
                      <span className="mx-1 flex-1 border-b border-dotted border-espresso-700/30" aria-hidden="true" />
                      <span className="font-serif font-semibold text-rust-600">{item.price}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-espresso-700/70">{item.description}</p>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center" delay={0.2}>
          <p className="font-serif text-xl italic text-espresso-700/80">
            Gluten-free & oat milk always available — just ask.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
