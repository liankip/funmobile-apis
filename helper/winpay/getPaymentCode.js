const axios = require('axios')

async function getPaymentCode(paymentMethod, data) {
  let result = await axios({
    method: 'post',
    url: paymentMethod,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: `orderdata=${data}`
  })
  let status = result.status
  let headers = JSON.parse(JSON.stringify(result.headers))
  let response = JSON.parse(JSON.stringify(result.data))
  let final = {
    status,
    headers,
    response
  }
  return final
}

module.exports = { getPaymentCode }