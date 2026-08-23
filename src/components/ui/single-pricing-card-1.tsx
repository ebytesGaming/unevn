'use client';
import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';

export function Pricing() {
	return (
		<section id="pricing" className="relative overflow-hidden py-24">
			<div className="mx-auto w-full max-w-6xl space-y-5 px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					viewport={{ once: true }}
					className="mx-auto max-w-xl space-y-5"
				>
					<div className="flex justify-center">
						<div className="rounded-lg border border-border px-4 py-1 font-mono text-sm text-muted-foreground">Pricing</div>
					</div>
					<h2 className="mt-5 text-center font-[var(--font-display)] text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
						Flat pricing, no packages to decode
					</h2>
					<p className="mt-5 text-center text-sm text-muted-foreground md:text-base">
						One price, agreed before I start. No hourly billing and nothing
						added later that you didn't ask for.
					</p>
				</motion.div>

				<div className="relative">
					<div
						className={cn(
							'z--10 pointer-events-none absolute inset-0 size-full',
							'bg-[linear-gradient(to_right,--theme(--color-foreground/.08)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.08)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--color-background)_10%,transparent)]',
						)}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						viewport={{ once: true }}
						className="mx-auto w-full max-w-2xl space-y-2"
					>	
						<motion.div
							whileHover={{ scale: 1.012 }}
							transition={{ type: 'spring', stiffness: 240, damping: 22 }}
							className="grid md:grid-cols-2 bg-surface relative border border-border p-4 rounded-xl"
						>
							<PlusIcon className="absolute -top-3 -left-3 size-5.5 text-muted-2" />
							<PlusIcon className="absolute -top-3 -right-3 size-5.5 text-muted-2" />
							<PlusIcon className="absolute -bottom-3 -left-3 size-5.5 text-muted-2" />
							<PlusIcon className="absolute -right-3 -bottom-3 size-5.5 text-muted-2" />

							<div className="w-full px-4 pt-5 pb-4">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold font-[var(--font-display)]">Starter</h3>
										<Badge variant="secondary">1 page</Badge>
									</div>
									<p className="text-muted-foreground text-sm">A single, sharp landing page.</p>
								</div>
								<div className="mt-10 space-y-4">
									<div className="text-muted-foreground flex items-end gap-0.5 text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl font-[var(--font-display)]">
											100
										</span>
										<span>CAD</span>
									</div>
									<Button className="w-full" variant="outline" asChild>
										<a href="/start-a-project">Start here</a>
									</Button>
								</div>
							</div>
							<div className="relative w-full rounded-lg border border-border px-4 pt-5 pb-4">
								<BorderTrail
									className="bg-white"
									style={{
										boxShadow:
											'0px 0px 60px 30px rgb(255 255 255 / 18%), 0 0 100px 60px rgb(255 255 255 / 10%), 0 0 140px 90px rgb(0 0 0 / 30%)',
									}}
									size={100}
								/>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold font-[var(--font-display)]">Full build</h3>
										<Badge>Most booked</Badge>
									</div>
									<p className="text-muted-foreground text-sm">Multi-page, custom, built to grow.</p>
								</div>
								<div className="mt-10 space-y-4">
									<div className="text-muted-foreground flex items-end text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl font-[var(--font-display)]">
											500
										</span>
										<span>CAD</span>
									</div>
									<Button className="w-full" asChild>
										<a href="/start-a-project">Let's talk</a>
									</Button>
								</div>
							</div>
						</motion.div>

						<div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
							<ShieldCheckIcon className="size-4" />
							<span>Need something between the two? Standard builds run $250–$350 CAD.</span>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
