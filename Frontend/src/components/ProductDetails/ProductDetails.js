import axios from 'axios';
import Navbar from '../Navbar/Navbar'
import { Helmet } from 'react-helmet'
import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function ProductDetails() {
    let [open, setOpen] = useState(false)
    let [orderForm, setOrderForm] = useState(false)
    let navigate = useNavigate()

    const product = JSON.parse(sessionStorage.getItem('product'))
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

    function nameValidate() {
        const name = document.getElementById('name')
        const nameError = document.getElementById('nameError')
        if (name.value === '') {
            nameError.innerText = "*Required"
        }
        else {
            nameError.innerText = ""
        }
    }

    function addressValidate() {
        const address = document.getElementById('address')
        const addressError = document.getElementById('addressError')
        if (address.value === '') {
            addressError.innerText = "*Required"
        }
        else {
            addressError.innerText = ""
        }
    }

    function mobileValidate() {
        const mobile = document.getElementById('mobile')
        const mobileError = document.getElementById('mobileError')
        if (mobile.value === '') {
            mobileError.innerText = "*Required"
        }
        else {
            mobileError.innerText = ""
        }
    }

    function confirmOrderClick() {
        const name = document.getElementById('name')
        const nameError = document.getElementById('nameError')
        const address = document.getElementById('address')
        const addressError = document.getElementById('addressError')
        const mobile = document.getElementById('mobile')
        const mobileError = document.getElementById('mobileError')
        const quantity = document.getElementById('quantity')
        const quantityError = document.getElementById('quantityError')
        const amount = document.getElementById('amount')
        const payment = document.getElementById('payment')
        if (name.value === '') {
            nameError.innerText = "*Required"
        }
        else {
            if (!isNaN(name.value)) {
                nameError.innerText = "*Invalid"
            }
            else {
                nameError.innerText = ""
            }
        }
        if (address.value === '') {
            addressError.innerText = "*Required"
        }
        else {
            addressError.innerText = ""
        }
        if (mobile.value === '') {
            mobileError.innerText = "*Required"
        }
        else {
            if (mobile.value.length < 10 || mobile.value.length > 10) {
                mobileError.innerText = "*Invalid"
            }
            else {
                mobileError.innerText = ""
            }
        }
        if (quantity.value < 1) {
            quantityError.innerText = "*Invalid"
        }
        else {
            quantityError.innerText = ""
        }
        if (nameError.innerText === "" && addressError.innerText === "" && mobileError.innerText === "" && quantityError.innerText === "") {
            const placedOrderData = {
                email: userInfo.email,
                userName: userInfo.name,
                name: product.productName,
                address: address.value,
                quantity: quantity.value,
                price: amount.value,
                paymentMode: payment.value,
                date: new Date().toLocaleString()
            }
            axios.post('https://pujari-jcb-spares-order.onrender.com/newOrder', placedOrderData)
                .then((response) => {
                    // console.log(response);
                    setOrderForm(false)
                    setOpen(true);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    function quantityChange() {
        const quantity = document.getElementById('quantity')
        const quantityError = document.getElementById('quantityError')
        const amount = document.getElementById('amount')
        const price = product.productPrice

        if (quantity.value < 1) {
            quantityError.innerText = "*Invalid"
        }
        else {
            quantityError.innerText = ""
            amount.value = price * quantity.value
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <>
            <Helmet>
                <title>Pujari JCB Spares | Product</title>
            </Helmet>

            <Navbar myProfile={true} logout={true} home={true} />

            <div className="mt-5 mb-4">
                <div className='ms-3 hoverText' style={{ width: 'fit-content', }}>
                    <h4 onClick={() => { navigate('/home') }}><i className="fa-solid fa-arrow-left-long"></i> Back</h4>
                </div>

                <div className='row position-relative top-0 start-50 translate-middle-x' style={{ width: '70%' }}>
                    <div className="col-3 border rounded" style={{ width: '300px', height: '305px' }}>
                        <img src={product.productImage} alt={product.productName} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="col-8 border rounded ms-5">
                        <div className='position-relative top-0 start-50 translate-middle-x mt-3' style={{ width: 'fit-content' }}>
                            <h6 className='fs-5 '>Name: {product.productName}</h6>
                            <h6 className='fs-5'>Model: {product.productModel}</h6>
                            <h6 className='fs-5'>Manufacturer: {product.productManufacturer}</h6>
                            <h6 className='fs-5'>Material: {product.productMaterial}</h6>
                            <h6 className='fs-5'>Length: {product.productLength}</h6>
                            <h6 className='fs-5'>Quantity: {product.productQuantity}</h6>
                            <h6 className='fs-5'>Price: Rs. {product.productPrice}</h6>
                        </div>
                        <div className='text-center mt-3'>
                            <button className='btn  btn-primary' onClick={() => { setOrderForm(true) }}>Place order</button>
                        </div>
                    </div>
                </div>

                {/* Place order form */}
                {
                    orderForm ? <div className='border rounded mt-4 col-6 position-relative top-0 start-50 translate-middle-x p-3'>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" aria-describedby="emailHelp" onKeyUp={() => { nameValidate() }} />
                                <span id='nameError' className='text-danger'></span>
                            </div>
                            <div className="col">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" className="form-control" id="address" aria-describedby="emailHelp" onKeyUp={() => { addressValidate() }} />
                                <span id='addressError' className='text-danger'></span>

                            </div>
                            <div className="col">
                                <label htmlFor="mobile" className="form-label">Contact number</label>
                                <input type="number" className="form-control" id="mobile" aria-describedby="emailHelp" onKeyUp={() => { mobileValidate() }} />
                                <span id='mobileError' className='text-danger'></span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" aria-describedby="emailHelp" defaultValue={1} onChange={() => { quantityChange() }} />
                                <span id='quantityError' className='text-danger'></span>
                            </div>
                            <div className="col">
                                <label htmlFor="amount" className="form-label">Amount</label>
                                <input type="number" className="form-control" id="amount" aria-describedby="emailHelp" readOnly defaultValue={product.productPrice} />
                            </div>
                            <div className="col">
                                <label htmlFor="payment" className="form-label">Payment mode</label>
                                <input type="text" className="form-control" id="payment" aria-describedby="emailHelp" defaultValue="Cash on delivery" readOnly />
                            </div>
                        </div>
                        <div className='text-center mt-3'>
                            <button type='submit' className='btn  btn-primary' onClick={() => { confirmOrderClick() }}>Confirm order</button>
                            <button type='submit' className='btn  btn-danger ms-3' onClick={() => { setOrderForm(false) }}>Cancle</button>
                        </div>
                    </div> : ""
                }

            </div>
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Order Placed !" action={action} /> : ''
            }
        </>
    )
}

export default ProductDetails