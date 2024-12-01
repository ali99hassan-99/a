// تحميل ملف Excel من الجذر
fetch('products.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });

        // قراءة أول ورقة عمل في ملف Excel
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // تحويل البيانات إلى JSON
        const products = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // حذف العنوان إذا كان موجودًا
        products.shift();

        // إنشاء عناصر HTML لكل منتج
        const productsContainer = document.getElementById('products');
        products.forEach(product => {
            const [image, name, description, oldPrice, newPrice] = product;

            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="images/${image}" alt="${name}">
                <h3>${name}</h3>
                <p>${description}</p>
                <p><del>السعر القديم: ${oldPrice} دينار</del></p>
                <p>السعر الجديد: ${newPrice} دينار</p>
                <button onclick="addToCart(${Math.random()}, '${name}', ${newPrice}, 'images/${image}')">أضف إلى السلة</button>
            `;

            productsContainer.appendChild(productDiv);
        });
    })
    .catch(error => console.error('Error loading the Excel file:', error));

// دالة لإضافة المنتجات إلى السلة
function addToCart(id, name, price, image) {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
        <img src="${image}" alt="${name}" style="width:50px;height:50px;">
        <span>${name}</span>
        <span>${price} دينار</span>
    `;

    cartItems.appendChild(itemDiv);
    cartCount.innerText = parseInt(cartCount.innerText) + 1;
    const currentTotal = parseInt(totalPrice.innerText.split(':')[1]) || 0;
    totalPrice.innerText = `المجموع: ${currentTotal + price} دينار`;
}

// دوال لإغلاق وفتح النوافذ
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function openCheckoutForm() {
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutForm() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// دالة لتأكيد الطلب
function confirmOrder() {
    // الحصول على البيانات المدخلة
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // التحقق من وجود البيانات المدخلة
    if (!name || !phone || !address) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    // الحصول على تفاصيل السلة
    const cartItems = document.getElementById('cart-items').getElementsByTagName('div');
    if (cartItems.length === 0) {
        alert('سلة التسوق فارغة');
        return;
    }

    let productList = '';
    let total = 0;

    // تجميع تفاصيل المنتجات في السلة
    for (let item of cartItems) {
        const productName = item.getElementsByTagName('span')[0].innerText;
        const productPrice = parseFloat(item.getElementsByTagName('span')[1].innerText);
        productList += `- ${productName}: ${productPrice} دينار\n`;
        total += productPrice;
    }

    // إنشاء محتوى رسالة WhatsApp
    const message = `طلب جديد:\nالاسم: ${name}\nرقم الهاتف: ${phone}\nالعنوان: ${address}\n\nالمنتجات:\n${productList}\nالمجموع: ${total} دينار`;

    // إرسال الرسالة عبر WhatsApp
    const phoneNumber = '07734263681'; // رقم الهاتف الذي سيتم إرسال الرسالة إليه
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');  // فتح WhatsApp لإرسال الرسالة

    // إغلاق نموذج الدفع
    closeCheckoutForm();
    alert('تم إرسال الطلب بنجاح!');
}
