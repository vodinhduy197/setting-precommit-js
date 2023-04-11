# Cài đặt validate message commit

## Cài đặt package
- [commitlint/cli](https://www.npmjs.com/package/@commitlint/cli)
- [husky](https://www.npmjs.com/package/husky)
```
# yarn
yarn add -D @commitlint/cli husky

# npm
npm install --save-dev @commitlint/cli husky
```

## Activate husky hook
```
# Activate hooks
npx husky install
# or
yarn husky install
```
- Sau khi chạy sẽ sinh ra folder `.husky` ở root project (chỉ chạy thành công với dự án đã khởi tạo git)
## Cài đặt husky
```
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```
- 
