const fs = require('fs');

const generateStaticParamsCode = `
export function generateStaticParams() {
  return [];
}
`;

const routes = [
  'app/batches/[batchId]/',
  'app/batches/[batchId]/exams/',
  'app/batches/[batchId]/exams/[examId]/grades/',
  'app/instructor/[id]/',
  'app/student/[id]/'
];

for (const route of routes) {
  const layoutPath = route + 'layout.tsx';
  if (!fs.existsSync(layoutPath)) {
    fs.writeFileSync(layoutPath, `export default function Layout({ children }: { children: React.ReactNode }) { return children; }\n` + generateStaticParamsCode);
  } else {
    let content = fs.readFileSync(layoutPath, 'utf8');
    if (!content.includes('generateStaticParams')) {
      fs.writeFileSync(layoutPath, content + '\n' + generateStaticParamsCode);
    }
  }
}
