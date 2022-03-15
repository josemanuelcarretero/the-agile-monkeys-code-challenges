import { Controller, Get, Render } from '@nestjs/common';

@Controller('/')
export class InitController {
  @Get()
  @Render('index.hbs')
  root() {
    return {
      title: 'Useful links',
      links: [
        {
          name: 'Crm in production',
          link: 'https://crm.josemanuelcarretero.me',
        },
        {
          name: 'Documentation in production',
          link: 'https://crm.josemanuelcarretero.me/api',
        },
        {
          name: 'Documentation in notion',
          link: 'https://www.notion.so/API-Test-The-CRM-Service-859ed65978194d418df1e182b986c47b',
        },
        {
          name: 'Source repository',
          link: 'https://github.com/josemanuelcarretero/the-agile-monkeys-code-challenges',
        },
        {
          name: 'LinkedIn',
          link: 'https://www.linkedin.com/in/jmcarretero/',
        },
      ],
    };
  }
}
