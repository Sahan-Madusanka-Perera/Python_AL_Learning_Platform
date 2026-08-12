import { notFound } from "next/navigation";
import { MODULES, getModule } from "@/lib/content";
import { ModuleView } from "./ModuleView";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) return {};
  return { title: `${mod.id} · ${mod.title}`, description: mod.tagline };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  return <ModuleView slug={slug} />;
}
