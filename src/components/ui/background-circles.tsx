import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface BackgroundCirclesProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    className?: string;
    variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
    primary: {
        border: [
            'border-emerald-500/60',
            'border-cyan-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-emerald-500/30',
    },
    secondary: {
        border: [
            'border-violet-500/60',
            'border-fuchsia-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-violet-500/30',
    },
    tertiary: {
        border: [
            'border-orange-500/60',
            'border-yellow-400/50',
            'border-espresso-700/20',
        ],
        gradient: 'from-orange-500/30',
    },
    quaternary: {
        border: [
            'border-purple-500/60',
            'border-pink-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-purple-500/30',
    },
    quinary: {
        border: [
            'border-red-500/60',
            'border-rose-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-red-500/30',
    },
    senary: {
        border: [
            'border-blue-500/60',
            'border-sky-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-blue-500/30',
    },
    septenary: {
        border: [
            'border-gray-500/60',
            'border-gray-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-gray-500/30',
    },
    octonary: {
        border: [
            'border-red-500/60',
            'border-rose-400/50',
            'border-slate-600/30',
        ],
        gradient: 'from-red-500/30',
    },
} as const;

const AnimatedGrid = () => (
    <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
        animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
        }}
    >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#8A7358_0%,#8A7358_1px,transparent_1px,transparent_4%)] opacity-20" />
    </motion.div>
);

export function BackgroundCircles({
    title = 'Background Circles',
    description,
    children,
    className,
    variant = 'tertiary',
}: BackgroundCirclesProps) {
    const variantStyles = COLOR_VARIANTS[variant];

    return (
        <div
            className={clsx(
                'relative flex min-h-screen w-full items-center justify-center overflow-hidden',
                'bg-cream-100',
                className
            )}
        >
            <AnimatedGrid />
            <motion.div className="absolute h-[480px] w-[480px]">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={clsx(
                            'absolute inset-0 rounded-full',
                            'border-2 bg-gradient-to-br to-transparent',
                            variantStyles.border[i],
                            variantStyles.gradient
                        )}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05 + i * 0.05, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,163,61,0.08),transparent_70%)] mix-blend-multiply" />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="relative z-10 px-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h2
                    className={clsx(
                        'font-serif text-5xl font-semibold tracking-tight md:text-7xl',
                        'bg-gradient-to-b from-espresso-900 to-espresso-700 bg-clip-text text-transparent'
                    )}
                >
                    {title}
                </h2>

                {description && (
                    <motion.p
                        className="mx-auto mt-6 max-w-xl text-lg text-espresso-700/80 md:text-xl"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {description}
                    </motion.p>
                )}

                {children && <div className="mt-10">{children}</div>}
            </motion.div>

            <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,163,61,0.18),transparent_70%)] blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,196,116,0.10),transparent)] blur-[80px]" />
            </div>
        </div>
    );
}
