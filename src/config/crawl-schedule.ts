/**
 * クローラー（scripts/crawl-studios.ts、各scripts/lib/*-fetcher.ts）が取得する日数と、
 * フロントエンドの日付ピッカーが選択可能とする日数の、唯一の共有ソース。
 * 以前はこの値が両側に別々のリテラル21として散らばっており、クロール側は
 * 「今日を含めてdayCount日分」(today 〜 today+dayCount-1)を取得する一方、
 * 日付ピッカー側は addDays(today, 21) を上限にしていたため、ピッカー側でだけ
 * 選択可能な「today+21日目」がクロールされておらず、Supabaseにデータが無い
 * まま選択されるとモックデータへ静かにフォールバックしてしまう食い違いがあった。
 * 「今日から3週間後（today+21日目）まで含める」を両側で一致させるにはdayCount=22
 * が必要（0始まりのループでtoday+21日目まで届かせるため）。
 */
export const CRAWL_DAY_COUNT = 22;
