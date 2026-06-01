const SKILLS = ['TypeScript', 'Next.js', 'Vue', 'NestJS', 'React', 'Qiankun', 'Prisma'];

const TIMELINE = [
  {
    title: '全栈工程师 · 某科技公司',
    period: '2022 — 至今',
    desc: '负责中后台与官网类产品，推动组件化与微前端落地。',
  },
  {
    title: '前端工程师 · 某互联网公司',
    period: '2019 — 2022',
    desc: '参与 C 端活动页与设计系统建设。',
  },
  {
    title: '计算机科学 · 某大学',
    period: '2015 — 2019',
    desc: '本科，主修软件工程与 Web 开发。',
  },
];

/** 关于我：静态介绍、技能、履历（MVP） */
export default function App() {
  return (
    <div>
      <section>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">关于我</h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          全栈开发者，专注 Web 前端工程化与个人品牌建设。喜欢用 Next.js、NestJS
          与 Qiankun 微前端构建可独立迭代的轻量站点。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">技能</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">履历</h2>
        <div className="border-l-2 border-gray-200 dark:border-gray-600 pl-6 space-y-6">
          {TIMELINE.map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.period}</p>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
