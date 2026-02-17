'use client';

import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Product + Growth Strategy',
    description: 'Building measurable growth loops across SaaS, fintech, and digital-first ventures.',
  },
  {
    title: 'Full-Stack Execution',
    description: 'Shipping from UX architecture to production-grade engineering with clear performance targets.',
  },
  {
    title: 'Quantitative UX',
    description: 'Pairing behavioral design with analytics to improve retention, conversion, and trust.',
  },
  {
    title: 'Operator Mindset',
    description: 'Translating ambiguity into clear roadmaps, focused teams, and durable business outcomes.',
  },
];

const timeline = [
  'Led multi-disciplinary delivery for digital products spanning growth, product, and engineering execution.',
  'Scaled brand and product positioning initiatives anchored in high-signal communication and outcomes.',
  'Built modern web experiences with performance-first architecture and premium UX systems.',
];

export default function BrandSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">Personal Brand Amplifier</p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Johnson Jose — Product-Led Growth Operator Building High-Performance Digital Systems.
        </h1>
        <p className="mt-5 max-w-3xl text-base text-zinc-300 md:text-lg">
          Strategic builder focused on product, engineering, and market positioning where execution quality is a
          competitive moat.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            className="glass rounded-xl p-5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <h3 className="text-lg font-medium">{pillar.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{pillar.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Selected Experience</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            {timeline.map((item) => (
              <li key={item} className="border-l border-cyan-300/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold">What I&apos;m Building</h3>
          <p className="mt-3 text-sm text-zinc-300">
            A category-defining portfolio at the intersection of creator equity, growth systems, and next-gen fintech
            interfaces.
          </p>
          <h4 className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-cyan-300">Core Stack</h4>
          <p className="mt-2 text-sm text-zinc-300">Product Strategy · UX Architecture · Next.js · Data Analytics · GTM Systems</p>
          <button className="mt-6 rounded-lg bg-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/30">
            Let&apos;s Build Together
          </button>
        </div>
      </div>
    </section>
  );
}
