# SPEC - Blind Bag Graduation Invitation (Rare Photocard Edition)

Hãy viết mã nguồn cho một trang web single-page (HTML + CSS + JavaScript thuần hoặc TailwindCSS) chạy hoàn toàn ở frontend.

Mục tiêu không phải chỉ là hiển thị thiệp mời, mà là tạo ra một trải nghiệm mở "Blind Bag" giống như mở gói thẻ Pokémon, idol photocard hoặc collectible card.

Website phải ưu tiên Mobile-first.

====================================================
1. PHONG CÁCH THIẾT KẾ
====================================================

Theme:

- Kawaii
- Magical Girl
- Luxury Pastel
- Cute Korean
- Collectible Card

Màu chủ đạo:

- Pearl White
- Pink Pastel
- Sakura Pink
- Cream
- Gold
- Champagne Gold

Hiệu ứng:

- Sparkle
- Glitter
- Bloom
- Glow
- Floating
- Soft Shadow
- Glassmorphism nhẹ
- Gradient dịu

Toàn bộ website sử dụng Pixel Font:

- Press Start 2P
hoặc
- DotGothic16

Animation phải mượt (60FPS).

====================================================
2. BACKGROUND
====================================================

Background không được tĩnh.

Luôn có:

- Heart particle
- Sparkle
- Sakura petals
- Floating stars
- Bubble light

Di chuyển rất chậm.

====================================================
3. GIAI ĐOẠN 1
SECRET BLIND BAG
====================================================

Chính giữa màn hình là một chiếc Blind Bag.

Thiết kế:

- Pearl White
- Viền Pink
- Gold Border
- Ribbon
- Pixel Art

Logo ở giữa:

Thay mặt trời bằng chiếc mũ tốt nghiệp Pixel màu hồng.

Bên dưới:

✨ Secret Graduation Invitation ✨

và

CLICK TO OPEN...

dòng chữ nhấp nháy.

Túi luôn có animation:

- breathing
- floating
- glow
- sparkle

====================================================
4. GIAI ĐOẠN 2
RIP OPEN
====================================================

Không mở ngay.

Người dùng phải tap khoảng 5 lần.

Lần 1

- túi rung

Lần 2

- xuất hiện đường răng cưa

Lần 3

- giấy cong

Lần 4

- vết rách mở rộng

Lần 5

- túi bị xé hoàn toàn

Mỗi lần click:

- shake
- paper particles
- glitter
- sparkle
- heart particle

Text thay đổi ngẫu nhiên:

KEEP GOING!!

ALMOST THERE!!

SO CLOSE!!

ONE MORE TAP!!

Hiệu ứng xé phải giống giấy thật.

Không dùng opacity đơn giản.

====================================================
5. GIAI ĐOẠN 3
MAGICAL REVEAL
====================================================

Ngay khi túi mở:

Background tối nhẹ.

Một luồng sáng trắng hồng phát ra từ bên trong.

Có:

- Bloom
- God Ray
- Sparkles
- Confetti
- Hearts
- Gold Glitter

Camera zoom nhẹ.

Toàn bộ trải nghiệm phải tạo cảm giác người dùng vừa mở được một "Rare Card".

====================================================
6. PHOTOCARD RARE
====================================================

KHÔNG hiện thiệp ngay.

Một Photocard bay lên từ bên trong túi.

Animation:

- bay lên
- xoay
- scale
- glow

Card phải giống:

- Pokémon card
- Idol photocard
- Rare collectible

====================================================
7. MẶT TRƯỚC PHOTOCARD
====================================================

Đây là điểm nhấn của toàn bộ website.

Mặt trước chỉ hiển thị ảnh của mình.

Ảnh lấy từ:

images/me.jpg

Nếu chưa có ảnh thì dùng placeholder.

Yêu cầu:

- bo góc lớn
- viền trắng
- viền vàng
- hiệu ứng hologram
- sparkle chạy quanh
- rainbow reflection
- ánh sáng lia ngang

Card nghiêng nhẹ theo chuyển động ngón tay (mobile) hoặc chuột (desktop).

Sau khi card xuất hiện:

Scale:

0.5 -> 1

Xoay khoảng 15 độ

Sau đó về chính diện.

====================================================
8. CONGRATULATION MOMENT
====================================================

Ngay trước khi card lật:

Hiện dòng chữ:

✨ CONGRATULATIONS! ✨

"You found a Secret Graduation Invitation!"

Xuất hiện khoảng 1 giây.

Sau đó biến mất.

====================================================
9. LẬT CARD
====================================================

Sau khoảng 2 giây.

Card tự lật bằng CSS 3D Flip.

Animation:

- perspective
- rotateY
- easing đẹp

====================================================
10. MẶT SAU
GRADUATION INVITATION
====================================================

Mặt sau KHÔNG được giống card thông tin.

Phải giống một tấm thiệp cao cấp.

Có:

- Lace border
- Pearl decoration
- Gold frame
- Ribbon
- Flowers
- Hearts
- Sparkles
- Emboss texture
- Soft shadow

====================================================
11. HEADER THIỆP
====================================================

Trên cùng:

🎓 Graduation Invitation

Có:

- 2 ngôi sao
- Ribbon
- Sparkle

====================================================
12. HERO PIXEL ART
====================================================

Phần trên của thiệp là Pixel Art.

Bao gồm:

- Graduation Cap
- Diploma
- Pink Ribbon
- Flower Bouquet
- Night Sky
- Moon
- Sparkle Stars

Không dùng ảnh thật.

====================================================
13. NỘI DUNG
====================================================

GRADUATION

TIME

09:30

12/07/2026

Sunday

PLACE

Hoi truong Le Thanh Tong

Phuong Cua Nam

Ha Noi

CONTACT

0969738404

====================================================
14. HIỆU ỨNG SAU KHI LẬT
====================================================

Background tiếp tục:

- Sakura
- Sparkle
- Hearts

Thiệp:

- Floating nhẹ
- Glow
- Shine animation

====================================================
15. ÂM THANH
====================================================

Có nút Music.

Góc dưới bên phải.

Icon pixel.

Nhạc:

Cute Lofi

Anime Piano

Nhạc chỉ phát sau lần chạm đầu tiên (tuân theo autoplay policy).

====================================================
16. KHÔNG CÓ REPLAY
====================================================

Không tạo nút:

Replay

Open Again

Try Again

Nếu muốn xem lại animation chỉ cần reload trang.

====================================================
17. KỸ THUẬT
====================================================

Chỉ Frontend.

HTML

CSS

JavaScript

Canvas dùng để tạo:

- Sparkle
- Confetti
- Hearts
- Paper pieces

Animation:

- requestAnimationFrame

Không dùng thư viện animation nặng.

====================================================
18. CHẤT LƯỢNG
====================================================

Website phải tạo cảm giác như:

"Một người vừa mở được Secret Rare Card chứa lời mời đặc biệt."

Người xem nên trải qua các cảm xúc:

✨ tò mò
✨ hồi hộp
✨ bất ngờ
✨ đáng yêu
✨ ấm áp
✨ được trân trọng

Toàn bộ animation phải có chiều sâu, mềm mại, tự nhiên và đáng nhớ thay vì chỉ là các hiệu ứng fade hoặc scale đơn giản.