import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const output = "projeto_completo_total.md";

const allFiles = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // nenhuma pasta será ignorada
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      allFiles.push(fullPath);
    }
  }
}

console.log("🔍 Varredura completa iniciada...");
walk(rootDir);

console.log(`📂 ${allFiles.length} arquivos encontrados.`);

let outputContent = "# 📦 PROJETO COMPLETO — TODOS OS ARQUIVOS\n\n";
outputContent += `**Diretório raiz:** ${rootDir}\n\n`;
outputContent += `**Total de arquivos incluídos:** ${allFiles.length}\n\n`;

for (const file of allFiles) {
  let ext = path.extname(file).replace(".", "");
  if (!ext) ext = "txt"; // arquivos sem extensão

  let content = "";
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    content = "⚠️ NÃO FOI POSSÍVEL LER (binário ou protegido)";
  }

  const relativePath = file.replace(rootDir + path.sep, "");

  outputContent += `\n\n---\n\n## 📄 ${relativePath}\n\n`;
  outputContent += `\`\`\`${ext}\n${content}\n\`\`\`\n`;
}

fs.writeFileSync(output, outputContent);
console.log(`✅ Arquivo combinado salvo em: ${output}`);
