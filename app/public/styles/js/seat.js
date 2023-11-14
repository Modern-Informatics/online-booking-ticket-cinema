document.addEventListener('DOMContentLoaded', () => {
    const schemeSvg = document.querySelector('.scheme_svg');
    const priceTotal = document.querySelector('.price_total');
    let cost = 500;
    let totalPrice = 0;
    schemeSvg.addEventListener('click', (event) => {
        if (!event.target.classList.contains('booked')&& (event.target.matches('path'))) {
            event.target.classList.toggle('active');
            totalPrice = cost*schemeSvg.querySelectorAll('.active').length;
            priceTotal.textContent = totalPrice;
        }
        
    });
    
});
