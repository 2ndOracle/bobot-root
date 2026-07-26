# BOBOT

Персональная корневая страница `bobot.click`: проекты, эксперименты и немного
интерактивных божьих коровок.

## Локальный запуск

Требуется Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Локальная страница откроется на `http://localhost:3000`.

## Проверка

```bash
npm run build
npm test
```

Статическая production-сборка создаётся в каталоге `out`.

## Деплой

Push в `main` автоматически собирает и публикует сайт через GitHub Pages.
Корневой домен проекта — `bobot.click`.

## Основные файлы

- `app/page.tsx` — содержимое страницы и интерактивные элементы;
- `app/globals.css` — визуальная система и адаптивная вёрстка;
- `app/layout.tsx` — метаданные страницы;
- `.github/workflows/pages.yml` — публикация в GitHub Pages.

## Проекты

- [Propose](https://propose.bobot.click)
- [SellSync](https://sellsync.bobot.click)
