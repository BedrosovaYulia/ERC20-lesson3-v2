# Разработка токенов ERC20 - урок 3:
## Организация пресейла для токена ERC-20

### Порядок работы:
1) Формируем файл .env по примеру .env-example
2) Далее выполняем команды для деплоинга первой версии имплементации:

```shell
npm install
npx hardhat run --network goerli scripts/deploy-V1.js
npx hardhat verify --network goerli <адрес-прокси>

```

3) Вписываем в скрипт deploy-V1.js адрес прокси
3) Выполняем команды для обновления версии имплементации


```shell
npx hardhat run --network goerli scripts/deploy-V2.js
npx hardhat verify --network goerli <адрес-новой-имплементации>

```
