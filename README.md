# tokyo-web3-hackathon
# ローカル開発の手順
ノードを立ち上げコントラクトをデプロイする。

## メタマスクに以下のアドレスを追加する
名前: Hardhat Account#0
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

※ このアカウントのメインネットにETHを送ったりすると、他の人もアクセスできるので、注意してください。あくまでもローカル開発の時のみ使ってください。

## ノードの立ち上げ

```
$ npm run node
```

## ローカルへコントラクトをデプロイ

```
$ npm run dev
```

## フロントエンドの立ち上げ

```
cd frontend
npm run dev
```

メタマスクの接続先がローカルになっていることを確認する。

## コントラクトの単体テスト

```
$ npm run test
```