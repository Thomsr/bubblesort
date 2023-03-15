import prompts from 'prompts';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

import {projectTemplate} from '../templates.js';
import {createDir} from '../../utils/createDir.js';
import {createFile} from '../../utils/createFile.js';

export async function addProject() {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project Name',
    initial: 'myProject',
    validate: value =>
      isValidProjectName(value) ? 'Project already exists.' : true,
  });
  await createProject(response.projectName);
}

function isValidProjectName(projectName) {
  return fs.existsSync(projectName + '.ts');
}

function findProject(ast) {}

async function createProject(projectName) {
  await createFile(path.resolve('src', projectName + '.ts'), projectTemplate());
  await createDir(path.resolve('src', 'scenes', projectName));
  // const ast = ts.createSourceFile('', );
  // console.log(ast);

  const transformer = context => node => {
    const visitor = node => {
      if (node.kind === ts.SyntaxKind.ExportAssignment) {
        return ts.factory.createStringLiteral('example');
      } else {
        return ts.visitEachChild(node, visitor, context);
      }
    };
    return ts.visitNode(node, visitor);
  };

  const transformed = ts.transform(fs.readFileSync('vite.config.ts', 'utf8'), [
    transformer,
  ]);
  console.log(transformed);

  // try {
  //     var parsed = esprima.parseScript(fs.readFileSync('vite.config.ts'))
  //     console.log(parsed);

  // } catch (e) {
  //     console.error(e);
  // }
}
