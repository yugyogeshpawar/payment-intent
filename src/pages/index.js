import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import MobileDetect from "mobile-detect";
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Grid, Typography, Button, DialogActions } from "@mui/material"; // Assuming you're using MUI for UI components
// Import QRCode component from the library you're using for QR code generation
import QRCode from "react-qr-code"; // This is just an example, ensure to use the correct import based on the library you choose

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [yourName, setYourName] = useState(null);
  const [open, setOpen] = useState(true); // Assuming you have a way to open/close the dialog

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(qrValue)
  }, [qrValue]);


  const createUpiLink = appName => {
    let upiLink = ''
    const merchantCode = '6012'
    const transactionReference = 'EZY2023082014160373026377'
    switch (appName) {
      case 'paytm':
        upiLink = `paytmmp://pay?pa=${qrValue}&pn=${yourName}&tr=${transactionReference}&cu=INR&mc=${merchantCode}&am=${amount}`
        break
      case 'googlePay':
        upiLink = `tez://upi/pay?pa=${qrValue}&pn=${yourName}&tr=${transactionReference}&cu=INR&mc=${merchantCode}&am=${amount}`
        break
      case 'phonePe':
        upiLink = `phonepe://pay?pa=${qrValue}&pn=${yourName}&tr=${transactionReference}&cu=INR&mc=${merchantCode}&am=${amount}`
        break
      case 'others':
        upiLink = `upi://pay?pa=${qrValue}&pn=${yourName}&tr=${transactionReference}&cu=INR&mc=${merchantCode}&am=${amount}`
        break
      default:
        break
    }

    return upiLink
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)

    const data = {
      amount: amount
    }

    const accessToken = window.localStorage.getItem('accessToken')

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }

      // const response = await axios.post('/api/payin', data, { headers: headers })
      const response2 = {
        qrValue: "payliopaymentssoluti@aubank",
        yourName: "John Doe"
      }
      setQrValue(response2.qrValue)
      setYourName(response2.yourName)
    } catch (error) {
      console.error('There was an error!', error)
    }

    setTimeout(() => {
      setIsSubmitting(false)
    }, 1000)
  }


  const handleChange = event => {
    setAmount(event.target.value)
  }

  const handleAppPayment = url => {
    const md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
      window.location.href = url
    } else {
      alert('Please use a mobile device to make the payment using the app')
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Top-Up Wallet (UPI)</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='amount'
              label='Amount'
              type='number'
              fullWidth
              variant='standard'
              value={amount}
              onChange={handleChange}
            />
            {qrValue && (
              <Grid container direction='column' alignItems='center'>
                <Typography variant='h6'>Scan the QR code to pay</Typography>
                <QRCode value={qrValue} size={256} />
                <Typography variant='body1'>Or pay using</Typography>
                <Grid container spacing={2} justifyContent='center'>
                  <Grid item>
                    <Button variant='outlined' onClick={() => handleAppPayment(createUpiLink('paytm'))}>
                      Paytm
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='outlined' onClick={() => handleAppPayment(createUpiLink('googlePay'))}>
                      Google Pay
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='outlined' onClick={() => handleAppPayment(createUpiLink('phonePe'))}>
                      PhonePe
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='outlined' onClick={() => handleAppPayment(createUpiLink('others'))}>
                      Others
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={isSubmitting} onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </main>
  );
}
