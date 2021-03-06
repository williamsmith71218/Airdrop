import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Button, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'


import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'

import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`
const Flex = styled.div`
  display: flex;
  padding: 10px 5px 5px;
  -webkit-box-align: center;
  align-items: center;
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: left;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const NotificationOldText = styled.div`
  margin-top: 5px;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #ff0050;
  background: linear-gradient(#1d5ebb, #4175bf);
  border-radius: 16px;
  color: #fff !important;
  font-size: 14px;
  font-weight: bold;
  height: auto;
  line-height: 1.5;
  padding: 0 8px;
  white-space: pre-wrap;
  place-content: center;
  margin-bottom: 10px;
`

// interface FarmCardProps {
//   farm: FarmWithStakedValue
//   removed: boolean
//   cakePrice?: BigNumber
//   bnbPrice?: BigNumber
//   ethereum?: provider
//   account?: string
// }

const StyledButton = styled(Button)`
  background: transparent;
  border: 1px solid #DF642B;
  border-radius: 12px;
  font: normal normal bold 16px/6px Swis721 BT;
  color: #DF642B;
  height: 46px;
  margin-right: 20px;
`;

const FarmCard: React.FC = () => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  // const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  // const { pid, lpAddresses, isTokenOnly, tokenAmount, depositFeeBP } = useFarmFromPid(farm.pid)
  // const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  // const rawEarningsBalance = getBalanceNumber(earnings)
  // const displayBalance = rawEarningsBalance.toLocaleString('en-US')
  // const rawStakingBalance = getBalanceNumber(stakedBalance)
  // const displayStakingBalance = rawStakingBalance.toLocaleString('en-US')

  // const numTokenAmount:number = +tokenAmount
  // const displayTotalToken = numTokenAmount.toFixed(4)

  // console.log('FarmCard!!!!!!')
  // const totalValue: BigNumber = useMemo(() => {
  //   if (!farm.lpTotalInQuoteToken) {
  //     return null
  //   }
  //   if (farm.quoteTokenSymbol === QuoteToken.BNB) {
  //     return bnbPrice.times(farm.lpTotalInQuoteToken)
  //   }
  //   if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
  //     return cakePrice.times(farm.lpTotalInQuoteToken)
  //   }
  //   return farm.lpTotalInQuoteToken
  // }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  // const totalValueFormated = totalValue
  //   ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  //   : '-'

  // const lpLabel = farm.tokenSymbol.concat(' POOL')
  // const earnLabel = '2LC'
  // const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   })

  // const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm

  // const handleApprove = useCallback(async () => {
  //   try {
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }, [])

  return (
    <FCard>
      {/* {farm.tokenSymbol === '2LC' && <StyledCardAccent />} */}
      
      <Flex >
        <Text fontSize="30px" >Introduce</Text>
        <Text fontSize="30px" >&nbsp;&nbsp;</Text>
      </Flex>

      <Divider />

      <Flex >
        <Text fontSize="20px">
          {TranslateString(999, 'Buy the highest amount of tokens and be rewarded with the following bonus:')}
        </Text>
      </Flex>

      <Flex >
        <svg xmlns="http://www.w3.org/2000/svg" width="19.45" height="19.45" viewBox="0 0 19.45 19.45">
          <g transform="translate(0 0)">
          <path d="M9.725,0A9.725,9.725,0,1,1,0,9.725H0A9.7,9.7,0,0,1,9.67,0Z" fill="#3bb54a" />
          <path d="M92.8,105.515l-6.907,6.907-3.868-3.84,1.575-1.547,2.293,2.266,5.332-5.332Z" transform="translate(-77.687 -98.47)" fill="#fff" />
          </g>
        </svg>
        &nbsp;&nbsp;
        <Text fontSize="20px">
          {TranslateString(999, '1st highest buyer gets 100% of the value of 2LC bought.')}
        </Text>
      </Flex>

      <Flex >
        <svg xmlns="http://www.w3.org/2000/svg" width="19.45" height="19.45" viewBox="0 0 19.45 19.45">
          <g transform="translate(0 0)">
          <path d="M9.725,0A9.725,9.725,0,1,1,0,9.725H0A9.7,9.7,0,0,1,9.67,0Z" fill="#3bb54a" />
          <path d="M92.8,105.515l-6.907,6.907-3.868-3.84,1.575-1.547,2.293,2.266,5.332-5.332Z" transform="translate(-77.687 -98.47)" fill="#fff" />
          </g>
        </svg>
        &nbsp;&nbsp;
        <Text fontSize="20px">
          {TranslateString(999, '2nd highest buyer gets 50% of the value of 2LC bought.')}
        </Text>
      </Flex>

       <Flex >
         <svg xmlns="http://www.w3.org/2000/svg" width="19.45" height="19.45" viewBox="0 0 19.45 19.45">
          <g transform="translate(0 0)">
          <path d="M9.725,0A9.725,9.725,0,1,1,0,9.725H0A9.7,9.7,0,0,1,9.67,0Z" fill="#3bb54a" />
          <path d="M92.8,105.515l-6.907,6.907-3.868-3.84,1.575-1.547,2.293,2.266,5.332-5.332Z" transform="translate(-77.687 -98.47)" fill="#fff" />
          </g>
          </svg>
        &nbsp;&nbsp;
        <Text fontSize="20px">
          {TranslateString(999, '3rd highest buyer gets 50% of the value of 2LC bought.')}
        </Text>
      </Flex>
      <Divider />
      {/* <Button fullWidth onClick={handleApprove}> */}
      <StyledButton size="sm" variant="tertiary" fullWidth>
        {TranslateString(999, 'Buy 2LC')}
      </StyledButton>
      {/* <Flex justifyContent="space-between">
        <Text>{TranslateString(10001, 'Deposit Fee')}:</Text>
        <Text bold>{farm.depositFeeBP / 100}%</Text>
      </Flex> */}
      {/* <Flex justifyContent="space-between">
        <Text>{TranslateString(999, 'Harvest Lockup')}:</Text>
        <Text bold>{farm.harvestInterval / 3600} Hour(s)</Text>
      </Flex> */}
    </FCard>
  )
}

export default FarmCard
