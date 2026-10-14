# Login 安全版本基準

[English](SECURITY_UPGRADE.md)

Login 應用程式對齊上游 ZITADEL `v4.19.4` 的 Login 原始碼，包含 session
cookie 項目簽章、簽章金鑰的就緒檢查，以及啟動時的憑證驗證。組織動畫、公開
showcase 白名單、嵌入限制與 standalone 圖片封裝仍由 fork 維護。
Go API 使用官方 `v4.19.4` 映像部署；本 fork 僅發布自訂 Login 映像，
不宣稱其 Go 原始碼也等同該版本。

請為 `ZITADEL_SESSION_COOKIE_SECRET` 設定至少 32 個字元的秘密值，
所有副本必須共用。將它保存在部署的秘密儲存區，勿放入原始碼、映像或交付
套件。可用逗號分隔多把金鑰以支援輪替：第一把簽署新項目，所有列出的金鑰
都能驗證既有項目。上游以 API 憑證作為備援的機制已棄用。

升級後會拒絕未簽章的舊 cookie，使用者必須重新登入 Login UI；既有應用程式
session 與已發出的 token 不受影響。API 與 Login 應一起升級，並驗證原生
登入、MFA、OIDC callback、登出與兩個公開 showcase 路徑，再接受部署結果。

執行 `NX_NO_CLOUD=true pnpm nx run-many --projects @zitadel/login --targets lint test-unit build`。
單元測試涵蓋缺少或偽造簽章、session ID 與 token 竄改、不合法簽章金鑰及
金鑰輪替。自訂映像 workflow 也會執行 standalone server，比對兩張圖片的
HTTP 回應與封裝的原始資產，接著發布以 digest 識別的 amd64 與 arm64 映像。

上游安全公告：[GHSA-jh92-5mrj-p2w2](https://github.com/zitadel/zitadel/security/advisories/GHSA-jh92-5mrj-p2w2)。
