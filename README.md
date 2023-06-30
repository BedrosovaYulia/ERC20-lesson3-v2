# Разработка токенов ERC20 - урок 3:
## Организация пресейла для токена ERC-20

### Порядок работы:
1) Формируем файл .env по примеру .env-example
2) Далее выполняем команды

```shell
npm install
npx hardhat compile
npx hardhat test
npx hardhat run --network goerli scripts/deploy-token-with-presale.js
npx hardhat verify --network goerli <адрес контракта>
```
