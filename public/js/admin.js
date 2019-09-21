const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productCard = btn.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        // return data from readable stream request body
        return result.json();
    })
    .then(data => {
        console.log(data);
        //works in all browsers
        productCard.parentNode.removeChild(productCard);
        // //doesn't work in IE
        // productCard.remove();
    })
    .catch(err => {
        console.log(err);
    });
};