import Image from 'next/image'
import { connect } from 'react-redux';
import React, { useState } from 'react';
import { useTranslations } from "next-intl"
import { useMutation, gql } from "@apollo/client"
import Input from '../../Input/Input'
import BaseContentLayout from '../../BaseContentLayout/BaseContentLayout'
import styles from "./BankAccountConnector.module.css"

const BankAccountConnector = ({ wallet, onNext }) => {
  const t = useTranslations("onboarding")

  const [user, setUser] = useState({
    username: '',
    password: '',
    connectionError: false
  });

  const updateInput = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const CONNECT_BANK = gql`
    mutation connectBank {
      connectBank(, username:"${user.username}", password:"${user.password}", wallet:"${wallet}"){success}
    }
  `
  const [connectBankMutation, { data, loading, error }] = useMutation(CONNECT_BANK) //, {errorPolicy: 'all'})

  const onContinue = () => {
    connectBankMutation()
      .then(() => onNext())
      .catch(err => {
        setUser({
          ...user,
          connectionError: true
        })
        return err
      })
  }

  const onRetry = () => {
    setUser({
      ...user,
      connectionError: false
    })
  }

  return (
    <BaseContentLayout  {...{
      submitButtonProps: {
        label: user.connectionError ? t('page2.try_again') : t('submitBtn'),
        onClick: user.connectionError ? onRetry : onContinue,
        disabled: !user.username || !user.password || !wallet,
        style: user.connectionError ? styles.customButton : null
      }
    }} >
      <div className={styles.wrapper}>
        <h1>{t('page2.title')}</h1>

        <Image
          src="/bank.svg"
          height={143}
          width={315}
          alt="Banco Hipotecario"
        />

        <h4>{t('page2.access_note')}</h4>

        <div className={styles.lockparagraph}>
          <h4>{t('page2.data_note')}</h4>
          <Image
            src="/lock.svg"
            className={styles.bar}
            height={160}
            width={80}
            alt="Banco Hipotecario"
          />
        </div>

        { user.connectionError ? 
          <div className={styles.errorconnecting}>
            <div className={styles.errorcircle} />
            {t('page2.connection_error')}
          </div>
          : 
          <div>
            <Input
              type="text"
              name="username"
              placeholder={t('page2.username')}
              onChange={updateInput} />

            <Input
              type='password'
              name='password'
              placeholder={t('page2.password')}
              onChange={updateInput}
            />
          </div>
        }

        { !user.connectionError  &&
          <div
            className={styles.skip}
            onClick={() => onNext()}
          >
            {t('page2.skip')}
          </div>
        }
    </div> 
  </BaseContentLayout>
  )
}

const mapStateToProps = function(state) {
  return {
    wallet: state.user.wallet_id
  }
}

export default connect(mapStateToProps)(BankAccountConnector)
