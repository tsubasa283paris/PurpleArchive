# Purple Archive

Gartic PhoneのGIFをみんなで保存してみんなで閲覧・検索しよう！

## 環境構築

1. WSL2のインストール  
   → <https://learn.microsoft.com/ja-jp/windows/wsl/install>

1. Node.jsおよびnpmのインストール  
   ```
   sudo apt update
   sudo apt install nodejs
   sudo apt install npm
   ```

1. このディレクトリでビルド・実行  
   （ホットリロードされるので試しに適当なソースをいじったりしてみよう）  
   ```
   npm run start
   ```

## 開発環境構築

1. VSCodeのインストール

1. 拡張機能Prettierのインストール

1. 当リポジトリを開いた状態で、VSCodeの設定（`Ctrl + ,`）を開き、`Workspace` タブを選択した状態で画面右上の「Open Settings (JSON)」を押下する。  
   開かれたJSONファイルに以下の項目を追加する。  
   ```json
   "[typescript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true
   }
   ```
