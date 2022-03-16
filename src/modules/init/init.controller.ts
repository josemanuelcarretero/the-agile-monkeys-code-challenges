import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('/')
export class InitController {
  @Get()
  @ApiExcludeEndpoint()
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
