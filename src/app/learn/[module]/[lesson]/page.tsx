import { notFound } from "next/navigation";
import { MODULES, getLesson, getModule } from "@/lib/content";
import { LessonView } from "./LessonView";

export function generateStaticParams() {
  return MODULES.flatMap((m) => m.lessons.map((l) => ({ module: m.slug, lesson: l.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: slug, lesson: lessonId } = await params;
  const lesson = getLesson(slug, lessonId);
  const mod = getModule(slug);
  if (!lesson || !mod) return {};
  return { title: `${lesson.title} · ${mod.id}`, description: lesson.summary };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: slug, lesson: lessonId } = await params;
  if (!getLesson(slug, lessonId)) notFound();
  return <LessonView slug={slug} lessonId={lessonId} />;
}
