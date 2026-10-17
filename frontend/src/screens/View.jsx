// Generated from design/black.tax App.dc.html by design/convert.py. Do not edit by hand.
import React from 'react';

export default function View(v) {
  const { L, activity, agent, agentRangeActive, agentSegs, approveBusy, approveConfirm, approveErrorText, approveFailed, arOpts, authA, authConsentErr, authIntentNew, authMasked, authPhoneBd, authPhoneErr, authTitle, avalanche, baseFreq, bellLabel, clearLedgerFilter, closeApprove, closeSheet, codeBd, codeErr, codeErrText, confirmDecline, confirmRemove, consentBd, consentBg, copyBean, copyEscrow, decisions, declineBtnBg, declineBtnFg, declineDisabled, declineNote, declineOther, declineReason, declineReasons, devExtras, devStates, devViews, dismissSetFailed, dissolve, dissolveText, editAmt, emptyDecBody, emptyDecTitle, emptyLoansText, entry, errTitle, exportCsv, finishSetup, firstCollection, freqHelp, freqSegs, gh, go, go2, goInvite, graceDown, graceText, graceUp, groceryStats, hasActivity, hasDecisions, hasLedger, hasLoans, hasReqs, hasRosterBanner, hasUnread, home, inv, invFailNum, invFailed, invNameBd, invNameErr, invPhoneBd, invPhoneErr, invSentName, invSentTo, inviteAll, inviteAllLabel, inviteRows, isApp, isGroceryStk, isMemberRole, isOnboarding, isTreasurer, ledgerAsOf, ledgerBal, ledgerBalAria, ledgerCols, ledgerFilterActive, ledgerFilterSummary, ledgerGroups, ledgerShown, ledgerTable, lend, lendTabs, lfRanges, lfShowLabel, lfTypes, loan, loans, markRead, me, member, memberCount, mv, navItems, nf, nfAction, nfDismiss, nfOn, noActivity, noDecisions, noLedger, noLoans, noReqs, notifList, ob, obPoolText, offline, offlineLabel, onbBack, onbProgress, onbStepNum, openAgentRange, openApprove, openCalc, openDecline, openEditAmt, openJoin, openLedgerFilter, openNotifs, openRemove, openSettingsFromSheet, openSwitcher, otpHint, otpHintOn, pageTitle, pctSegs, preamble, preventNav, queueOpts, r, recycleKnob, recycleTrack, removeText, reqs, resendCode, reserveText, resumeAgent, retry, roster, rosterBanner, saveEditAmt, scrollQueue, sendCode, sendInvite, setAuthPhone, setCode, setDeclineNote, setDeclineReason, setDissolve, setEditAmt, setFailed, setInvAmount, setInvName, setInvPhone, setObAmount, setObCount, setObName, setObReserve, settings, settleLabel, settlePct, settled, sh, shareInviteWa, sheetOpen, sheetTitle, showDemo, signInAgain, skelRows, startApprove, stat, sv, switchToGrocery, switcherRows, tabItems, toastOn, toastText, toggleConsent, toggleOffline, toggleRecycle, treasurerFirst, typeCards, typeRequest, verifyCode, voteRequest } = v;
  return (<><div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>

  {(showDemo) ? (<>
  <div style={{height: '56px', flex: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', background: '#0A0908', color: '#FAF7F2', overflowX: 'auto', fontSize: '12px'}}>
    <span style={{fontWeight: '600', whiteSpace: 'nowrap', color: '#B5ABA1'}}>Demo</span>
    <div style={{display: 'flex', gap: '2px', background: '#3D3733', borderRadius: '8px', padding: '2px', flex: 'none'}}>
      {(devViews).map((d, __i0) => (<React.Fragment key={__i0}>
        <button onClick={d.on} style={{height: '32px', padding: '0 10px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', background: d.bg, color: d.fg}}>{d.label}</button>
      </React.Fragment>))}
    </div>
    <div style={{display: 'flex', gap: '2px', background: '#3D3733', borderRadius: '8px', padding: '2px', flex: 'none'}}>
      {(devStates).map((d, __i1) => (<React.Fragment key={__i1}>
        <button onClick={d.on} style={{height: '32px', padding: '0 10px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', background: d.bg, color: d.fg}}>{d.label}</button>
      </React.Fragment>))}
    </div>
    <div style={{display: 'flex', gap: '4px', flex: 'none'}}>
      {(devExtras).map((d, __i2) => (<React.Fragment key={__i2}>
        <button onClick={d.on} style={{height: '32px', padding: '0 10px', border: '1px solid #6B625B', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', background: 'transparent', color: '#FAF7F2'}}>{d.label}</button>
      </React.Fragment>))}
    </div>
    <button onClick={toggleOffline} style={{height: '32px', padding: '0 10px', border: '1px solid #6B625B', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', background: 'transparent', color: '#FAF7F2', flex: 'none'}}>{offlineLabel}</button>
  </div>
  </>) : null}

  <div style={{flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: L.outerPad}}>
  <div style={{position: 'relative', overflow: 'hidden', background: '#FAF7F2', width: L.frameW, maxWidth: '100%', height: L.frameH, borderRadius: L.frameR, boxShadow: L.frameShadow}}>

    {(isOnboarding) ? (<>
      <div style={{position: 'absolute', inset: '0', overflowY: 'auto', background: '#FAF7F2'}}>

        {(r.welcome) ? (<>
          <div style={{minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', boxSizing: 'border-box', gap: '48px', textAlign: 'center'}}>
            <div style={{flex: '1'}}></div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'}}>
              <div style={{fontWeight: '600', fontSize: '56px', letterSpacing: '-0.04em', lineHeight: '1'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
              <div style={{fontFamily: 'Fraunces', fontOpticalSizing: 'auto', fontSize: '22px', lineHeight: '1.3', color: '#3D3733', letterSpacing: '-0.01em'}}>What goes out, comes back.</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '340px'}}>
              <button onClick={go.signup} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h0">Start a stokvel</button>
              <button onClick={openJoin} style={{height: '48px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#3D3733', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h1">Join a stokvel</button>
            </div>
            <div style={{flex: '1'}}></div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'}}>
              <button onClick={go.signinExisting} style={{border: 'none', background: 'transparent', minHeight: '44px', fontSize: '14px', color: '#0A0908', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Already have an account? Sign in</button>
              <div style={{fontSize: '12px', color: '#6B625B'}}>Built for South African stokvels.</div>
            </div>
          </div>
        </>) : null}

        {(r.onbStep) ? (<>
          <div style={{position: 'sticky', top: '0', zIndex: '2', background: '#FAF7F2', borderBottom: '1px solid #E8E1D8'}}>
            <div style={{maxWidth: '960px', margin: '0 auto', height: '56px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 0 4px'}}>
              <button onClick={onbBack} aria-label='Back' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button>
              <div style={{fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
              <div style={{marginLeft: 'auto', fontSize: '12px', color: '#6B625B', paddingRight: '8px', fontVariantNumeric: 'tabular-nums'}}>Step {onbStepNum} of 4</div>
            </div>
            <div style={{height: '2px', background: '#E8E1D8'}}><div style={{height: '2px', background: '#0A0908', width: onbProgress, transition: 'width 250ms cubic-bezier(0.2,0,0,1)'}}></div></div>
          </div>
        </>) : null}

        {(r.authHeader) ? (<>
          <div style={{position: 'sticky', top: '0', zIndex: '2', background: '#FAF7F2', borderBottom: '1px solid #E8E1D8'}}>
            <div style={{maxWidth: '560px', margin: '0 auto', height: '56px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 0 4px'}}>
              <button onClick={onbBack} aria-label='Back' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button>
              <div style={{fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
            </div>
          </div>
        </>) : null}

        {(r.signin) ? (<>
          <div style={{maxWidth: '560px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>{authTitle}</h1>
              <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>We'll send a 6-digit code by SMS. No password to remember.</p>
            </div>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Mobile number</span>
              <span style={{height: '48px', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box', border: `1px solid ${authPhoneBd}`}}><span style={{color: '#6B625B', fontSize: '15px'}}>+27</span><input inputMode='tel' autoComplete='tel-national' value={authA.phone} onChange={setAuthPhone} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span>
              {(authPhoneErr) ? (<><span style={{fontSize: '12px', color: '#9C3A27'}}>Enter all 10 digits, starting with 0.</span></>) : null}
            </label>
            {(authIntentNew) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <button role='checkbox' aria-checked={authA.consent} onClick={toggleConsent} style={{display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 'none', padding: '4px 0', cursor: 'pointer', color: '#0A0908', minHeight: '44px'}}>
                  <span style={{width: '22px', height: '22px', borderRadius: '6px', flex: 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF7F2', marginTop: '1px', background: consentBg, border: `1.5px solid ${consentBd}`}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2.25' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M3.5 8.5l3 3 6-7'></path></svg></span>
                  <span style={{fontSize: '14px', lineHeight: '1.5'}}>I agree that black.tax may process my personal information to run my stokvel, as set out in the <a href='#' style={{fontWeight: '500'}}>privacy notice</a>. This includes my phone number, my bank mandate, and, for Debt-Payoff stokvels, the debts I declare.</span>
                </button>
                {(authConsentErr) ? (<><span style={{fontSize: '12px', color: '#9C3A27', paddingLeft: '34px'}}>We need your agreement before we can create your account. You can withdraw it later in settings.</span></>) : null}
                <p style={{margin: '0', fontSize: '12px', lineHeight: '1.5', color: '#6B625B', paddingLeft: '34px'}}>We never sell your information. Other members see your name, contribution status and, in Debt-Payoff stokvels, your place in the queue.</p>
              </div>
            </>) : null}
            <button onClick={sendCode} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Send code</button>
          </div>
        </>) : null}

        {(r.otp) ? (<>
          <div style={{maxWidth: '560px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>Enter your code</h1>
              <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>We sent a 6-digit code to {authMasked}. It expires in 10 minutes.</p>
            </div>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Code</span>
              <input inputMode='numeric' autoComplete='one-time-code' maxLength='6' value={authA.code} onChange={setCode} aria-describedby='otp-help' style={{height: '56px', borderRadius: '8px', background: '#FFFFFF', padding: '0 16px', fontFamily: '\'JetBrains Mono\',monospace', fontSize: '24px', letterSpacing: '0.5em', color: '#0A0908', outline: 'none', boxSizing: 'border-box', border: `1px solid ${codeBd}`}} className="dc-f4" />
              {(codeErr) ? (<><span role='alert' style={{fontSize: '12px', color: '#9C3A27'}}>{codeErrText}</span></>) : null}
              {(otpHintOn) ? (<><span id='otp-help' style={{fontSize: '12px', color: '#6B625B'}}>{otpHint}</span></>) : null}
            </label>
            <button onClick={verifyCode} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Continue</button>
            <button onClick={resendCode} style={{alignSelf: 'center', border: 'none', background: 'transparent', minHeight: '44px', fontSize: '14px', fontWeight: '500', color: '#0A0908', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Send a new code</button>
          </div>
        </>) : null}

        {(r.expired) ? (<>
          <div style={{minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', boxSizing: 'border-box'}}>
            <div style={{maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
              <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>You've been signed out</h1>
              <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>For your security, we sign you out after 30 minutes without activity. Your stokvel's money and records haven't changed.</p>
              <button onClick={signInAgain} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer', width: '100%'}} className="dc-h0">Sign in again</button>
            </div>
          </div>
        </>) : null}

        {(r.onbType) ? (<>
          <div style={{maxWidth: '960px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box'}}>
            <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>What kind of stokvel?</h1>
            <div role='radiogroup' aria-label='Stokvel type' style={{display: 'grid', gridTemplateColumns: L.typeCols, gap: '12px'}}>
              {(typeCards).map((t, __i3) => (<React.Fragment key={__i3}>
                <button role='radio' aria-checked={t.sel} onClick={t.on} style={{textAlign: 'left', minHeight: '88px', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#0A0908', transition: 'border-color 150ms,background 150ms', background: t.bg, border: `1.5px solid ${t.bd}`}} className="dc-h5">
                  <svg width='32' height='32' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none'}}><path d={t.icon}></path></svg>
                  <span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '17px', fontWeight: '600', letterSpacing: '-0.01em'}}>{t.title}</span><span style={{fontSize: '14px', lineHeight: '1.45', color: '#3D3733'}}>{t.desc}</span></span>
                  <span style={{width: '20px', height: '20px', borderRadius: '999px', flex: 'none', boxSizing: 'border-box', marginTop: '2px', border: t.radioBd, background: '#FFFFFF'}}></span>
                </button>
              </React.Fragment>))}
            </div>
            <button onClick={go.onbDetails} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', width: '100%', maxWidth: '400px', alignSelf: 'flex-end'}} className="dc-h3">Continue</button>
          </div>
        </>) : null}

        {(r.onbDetails) ? (<>
          <div style={{maxWidth: '560px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box'}}>
            <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>The basics</h1>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Stokvel name</span>
              <input value={ob.name} onChange={setObName} style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', padding: '0 16px', fontSize: '15px', color: '#0A0908', outline: 'none', boxSizing: 'border-box'}} className="dc-f4" />
              <span style={{fontSize: '12px', color: '#6B625B'}}>Members see this name on every SMS and WhatsApp message.</span>
            </label>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Contribution per member</span>
              <span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={ob.amount} onChange={setObAmount} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span>
            </label>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>How often</span>
              <div role='radiogroup' aria-label='Frequency' style={{display: 'flex', padding: '4px', background: '#E8E1D8', borderRadius: '8px', gap: '4px'}}>
                {(freqSegs).map((o, __i4) => (<React.Fragment key={__i4}>
                  <button role='radio' aria-checked={o.sel} onClick={o.on} style={{flex: '1', height: '40px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 150ms', background: o.bg, color: o.fg, boxShadow: o.sh}}>{o.label}</button>
                </React.Fragment>))}
              </div>
              <span style={{fontSize: '12px', color: '#6B625B'}}>{freqHelp}</span>
            </div>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Number of members</span>
              <input inputMode='numeric' value={ob.count} onChange={setObCount} style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', padding: '0 16px', fontSize: '15px', color: '#0A0908', outline: 'none', boxSizing: 'border-box', fontVariantNumeric: 'tabular-nums'}} className="dc-f4" />
              <span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>Including you. The pool collects {obPoolText} each time.</span>
            </label>
            <button onClick={go.onbConst} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Continue</button>
          </div>
        </>) : null}

        {(r.onbConst) ? (<>
          <div style={{maxWidth: '560px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>Your constitution</h1>
              <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>These are the rules the agent follows. You can change any of them later, and every change is written to the ledger.</p>
            </div>
            <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Reserve floor</span>
              <span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={ob.reserve} onChange={setObReserve} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span>
              <span style={{fontSize: '12px', lineHeight: '1.45', color: '#6B625B'}}>We recommend keeping R5,000 aside, paid as a R500 joining contribution each. The pool never pays a lender from this money, so one late contribution can't stop the plan.</span>
            </label>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Who gets paid first</span>
              <div role='radiogroup' style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {(queueOpts).map((q, __i5) => (<React.Fragment key={__i5}>
                  <button role='radio' aria-checked={q.sel} onClick={q.on} style={{textAlign: 'left', minHeight: '64px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#0A0908', background: q.bg, border: `1.5px solid ${q.bd}`}}>
                    <span style={{width: '20px', height: '20px', borderRadius: '999px', flex: 'none', boxSizing: 'border-box', marginTop: '1px', border: q.radioBd, background: '#FFFFFF'}}></span>
                    <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px', fontWeight: '500'}}>{q.title}</span><span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.45'}}>{q.desc}</span></span>
                  </button>
                </React.Fragment>))}
              </div>
              {(ob.byRate) ? (<>
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', display: 'flex', flexDirection: 'column'}}>
                  <div style={{padding: '12px 16px', fontSize: '12px', color: '#6B625B', borderBottom: '1px solid #E8E1D8'}}>Proposed order from members' declared debts</div>
                  {(avalanche).map((a, __i6) => (<React.Fragment key={__i6}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', minHeight: '44px', boxSizing: 'border-box', fontSize: '14px', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid #F2EDE6'}}>
                      <span style={{fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#6B625B', width: '20px'}}>{a.n}</span>
                      <span style={{flex: '1'}}>{a.name}</span>
                      <span style={{color: '#3D3733'}}>{a.rate}</span>
                    </div>
                  </React.Fragment>))}
                  <div style={{padding: '12px 16px', fontSize: '12px', color: '#6B625B'}}>Members vote to confirm this order when they accept the invite.</div>
                </div>
              </>) : null}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <button role='switch' aria-checked={ob.recycle} onClick={toggleRecycle} style={{display: 'flex', gap: '16px', alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 'none', padding: '0', cursor: 'pointer', color: '#0A0908', minHeight: '44px'}}>
                <span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '15px', fontWeight: '500'}}>Cleared members redirect their minimum into the pool</span><span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.45'}}>When your debt is cleared, the minimum you used to pay your lender goes into the pool until everyone is free.</span></span>
                <span style={{width: '44px', height: '26px', borderRadius: '999px', flex: 'none', position: 'relative', transition: 'background 150ms', background: recycleTrack}}><span style={{position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', transition: 'left 150ms cubic-bezier(0.2,0,0,1)', left: recycleKnob}}></span></span>
              </button>
              {(ob.recycle) ? (<>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: '16px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Share redirected</span>
                    <div style={{display: 'flex', padding: '4px', background: '#E8E1D8', borderRadius: '8px', gap: '4px'}}>
                      {(pctSegs).map((o, __i7) => (<React.Fragment key={__i7}>
                        <button onClick={o.on} aria-pressed={o.sel} style={{flex: '1', height: '40px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontVariantNumeric: 'tabular-nums', background: o.bg, color: o.fg, boxShadow: o.sh}}>{o.label}</button>
                      </React.Fragment>))}
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Grace period</span>
                    <div style={{display: 'flex', alignItems: 'center', height: '48px', border: '1px solid #948779', borderRadius: '8px', background: '#FFFFFF', overflow: 'hidden'}}>
                      <button onClick={graceDown} aria-label='Fewer months' style={{width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">−</button>
                      <span style={{flex: '1', textAlign: 'center', fontSize: '15px', fontVariantNumeric: 'tabular-nums'}}>{graceText}</span>
                      <button onClick={graceUp} aria-label='More months' style={{width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">+</button>
                    </div>
                  </div>
                </div>
              </>) : null}
            </div>
            <div style={{border: '1px solid #948779', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#FFFFFF'}}>
              <div style={{fontSize: '15px', fontWeight: '600'}}>When a member joins, they agree to:</div>
              {(preamble).map((p, __i8) => (<React.Fragment key={__i8}>
                <div style={{display: 'flex', gap: '12px', fontSize: '14px', lineHeight: '1.5', color: '#0A0908'}}><span style={{fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#6B625B', paddingTop: '2px'}}>{p.n}</span><span>{p.text}</span></div>
              </React.Fragment>))}
            </div>
            <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <div style={{fontSize: '15px', fontWeight: '600'}}>Where the money sits</div>
              <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Contributions are collected into your stokvel's own account, not a black.tax account. black.tax never holds your money. Payments to lenders go out by EFT, and any loan to another stokvel settles in USDC through an escrow on Arc that releases funds only under these rules. Every movement is written to the ledger.</p>
            </div>
            <button onClick={go.onbInvite} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Create stokvel</button>
          </div>
        </>) : null}

        {(r.onbInvite) ? (<>
          <div style={{maxWidth: '560px', margin: '0 auto', padding: '32px 16px 48px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>Invite your members</h1>
              <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>Each member will receive a link to authenticate their DebiCheck mandate with their bank.</p>
              <p style={{margin: '0', fontSize: '13px', lineHeight: '1.55', color: '#6B625B'}}>The mandate lets the stokvel collect the agreed amount on the agreed date, nothing more. Members can cancel it with their bank at any time; you'll be told if they do.</p>
            </div>
            <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', display: 'flex', flexDirection: 'column'}}>
              {(inviteRows).map((m, __i9) => (<React.Fragment key={__i9}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '68px', boxSizing: 'border-box', borderBottom: '1px solid #F2EDE6'}}>
                  <span style={{width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', flex: 'none', background: m.avBg, color: '#3D3733'}}>{m.ini}</span>
                  <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px'}}>{m.name}</span><span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{m.sub}</span></span>
                  {(m.canInvite) ? (<>
                    <button onClick={m.on} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">Invite</button>
                  </>) : null}
                  {(m.invited) ? (<>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', background: '#F7EEDC', color: '#84591A', fontSize: '12px', fontWeight: '500'}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' aria-hidden='true'><path d='M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M8 5v3.2l2 1.3'></path></svg>SMS sent</span>
                  </>) : null}
                  {(m.you) ? (<>
                    <span style={{fontSize: '12px', color: '#6B625B'}}>You</span>
                  </>) : null}
                </div>
              </React.Fragment>))}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <button onClick={inviteAll} style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">{inviteAllLabel}</button>
              <button onClick={finishSetup} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Finish setup</button>
            </div>
          </div>
        </>) : null}
      </div>
    </>) : null}

    {(isApp) ? (<>
      <div style={{position: 'absolute', inset: '0', display: 'flex'}}>

        {(L.isDesk) ? (<>
          <aside style={{width: '240px', flex: 'none', borderRight: '1px solid #E8E1D8', background: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '16px 12px', boxSizing: 'border-box', gap: '24px'}}>
            <div style={{padding: '8px 12px', fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
            <button onClick={openSwitcher} style={{textAlign: 'left', border: '1px solid #E8E1D8', borderRadius: '8px', background: '#FAF7F2', padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0A0908'}} className="dc-h5">
              <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{sv.name}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{sv.typeLabel}</span></span>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M5 6l3-3 3 3M5 10l3 3 3-3'></path></svg>
            </button>
            <nav style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              {(navItems).map((n, __i10) => (<React.Fragment key={__i10}>
                <button onClick={n.on} aria-current={n.cur} style={{height: '40px', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', background: n.deskBg, color: n.fg}} className="dc-h7">
                  <svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={n.icon}></path></svg>{n.label}
                </button>
              </React.Fragment>))}
            </nav>
            <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderTop: '1px solid #E8E1D8', paddingTop: '16px'}}>
              <span style={{width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#3D3733', background: me.avBg}}>{me.ini}</span>
              <span style={{display: 'flex', flexDirection: 'column'}}><span style={{fontSize: '13px', fontWeight: '500'}}>{me.name}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{me.roleLine}</span></span>
            </div>
          </aside>
        </>) : null}

        {(L.isTablet) ? (<>
          <aside style={{width: '72px', flex: 'none', borderRight: '1px solid #E8E1D8', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '16px'}}>
            <div style={{fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em', height: '40px', display: 'flex', alignItems: 'center'}}>b<span style={{color: '#C97B3C'}}>.</span>t</div>
            {(navItems).map((n, __i11) => (<React.Fragment key={__i11}>
              <button onClick={n.on} aria-label={n.label} title={n.label} style={{width: '48px', height: '48px', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: n.deskBg, color: n.fg}} className="dc-h7">
                <svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={n.icon}></path></svg>
              </button>
            </React.Fragment>))}
          </aside>
        </>) : null}

        <div style={{flex: '1', minWidth: '0', overflowY: 'auto', position: 'relative'}}>
          <header style={{position: 'sticky', top: '0', zIndex: '5', background: '#FAF7F2', borderBottom: '1px solid #E8E1D8'}}>
            <div style={{maxWidth: '1280px', margin: '0 auto', height: '56px', display: 'flex', alignItems: 'center', gap: '12px', padding: `0 ${L.padX}`, boxSizing: 'border-box'}}>
              {(L.isMobile) ? (<>
                <div style={{fontWeight: '600', fontSize: '15px', letterSpacing: '-0.04em'}}>black<span style={{color: '#C97B3C'}}>.</span>tax</div>
              </>) : null}
              {(L.hasRail) ? (<>
                <div style={{fontSize: '15px', fontWeight: '600', letterSpacing: '-0.01em'}}>{pageTitle}</div>
              </>) : null}
              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <button onClick={openNotifs} aria-label={bellLabel} style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2">
                  <svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 13.5a1.5 1.5 0 0 0 3 0'></path></svg>
                  {(hasUnread) ? (<><span style={{position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', borderRadius: '999px', background: '#B5452F', border: '2px solid #FAF7F2'}}></span></>) : null}
                </button>
                <button onClick={openSwitcher} aria-label={`${me.name}, account and stokvels`} style={{width: '44px', height: '44px', border: 'none', background: 'transparent', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#3D3733', background: me.avBg, border: '1px solid #E8E1D8', boxSizing: 'border-box'}}>{me.ini}</span></button>
              </div>
            </div>
          </header>

          {(offline) ? (<>
            <div role='status' style={{background: '#0A0908', color: '#FAF7F2', fontSize: '13px', lineHeight: '1.45'}}>
              <div style={{maxWidth: '1280px', margin: '0 auto', padding: `10px ${L.padX}`, display: 'flex', gap: '12px', alignItems: 'flex-start', boxSizing: 'border-box'}}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M2 2l12 12M5.5 10.5a3.5 3.5 0 0 1 5 0M3 8a7 7 0 0 1 3-1.8M13 8a7 7 0 0 0-2.4-1.6M8 13v.01'></path></svg>
                <span>You're offline. Figures are from 06:08 today. Anything you approve will send when you reconnect.</span>
              </div>
            </div>
          </>) : null}

          <main style={{maxWidth: '1280px', margin: '0 auto', padding: L.mainPad, boxSizing: 'border-box'}}>

            {(r.homeDebt) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <button onClick={openSwitcher} style={{textAlign: 'left', border: 'none', background: 'transparent', padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0A0908', minHeight: '44px', alignSelf: 'flex-start', maxWidth: '100%'}}>
                  <span style={{display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0'}}><span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3'}}>{sv.name}</span><span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{home.idLine}</span></span>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none'}}><path d='M4 6l4 4 4-4'></path></svg>
                </button>

                {(home.pausedBanner) ? (<>
                  <div role='alert' style={{background: '#F7EEDC', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', lineHeight: '1.45', flexWrap: 'wrap'}}>
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#84591A' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M6.7 6v4M9.3 6v4'></path></svg>
                    <span style={{flex: '1', minWidth: '200px'}}><b style={{fontWeight: '600'}}>{home.bannerBold}</b> {home.bannerText}</span>
                  </div>
                </>) : null}

                <div style={{display: 'grid', gridTemplateColumns: L.homeCols, gap: '24px', alignItems: 'start'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '0'}}>

                    <section aria-label={home.heroAria} style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0'}}>
                      <div style={{fontSize: '12px', color: '#6B625B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500'}}>{home.heroLabel}</div>
                      <button onClick={go.ledger} aria-label={`${home.heroAria}. View ledger.`} style={{textAlign: 'left', border: 'none', background: 'transparent', padding: '0', cursor: 'pointer', fontFamily: 'Fraunces', fontOpticalSizing: 'auto', fontWeight: '400', lineHeight: '1.05', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: L.heroSize, color: home.heroColor, alignSelf: 'flex-start'}}>{home.heroValue}</button>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', color: home.deltaColor}}>
                        {(home.deltaArrow) ? (<><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M8 3v10M4 9l4 4 4-4'></path></svg></>) : null}
                        <span>{home.delta}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px'}}>
                        <div role='progressbar' aria-valuenow={home.pctNum} aria-valuemin='0' aria-valuemax='100' aria-label='Share of debt cleared' style={{flex: '1', height: '8px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#C97B3C', borderRadius: '999px', width: home.pct}}></div></div>
                        <span style={{fontSize: '12px', color: '#3D3733', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{home.pctLabel}</span>
                      </div>
                    </section>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: L.statGap}}>
                      {(home.stats).map((s, __i12) => (<React.Fragment key={__i12}>
                        <button onClick={s.on} aria-label={s.aria} style={{textAlign: 'left', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.statPad, display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', color: '#0A0908', minWidth: '0', transition: 'border-color 150ms'}} className="dc-h5 dc-a8">
                          <span style={{fontSize: '12px', color: '#6B625B', lineHeight: '1.3'}}>{s.label}</span>
                          <span style={{fontFamily: 'Fraunces', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: L.statFig, color: s.color, overflowWrap: 'anywhere'}}>{s.value}</span>
                        </button>
                      </React.Fragment>))}
                    </div>

                    {(home.showFocus) ? (<>
                      <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'}}>
                          <span style={{fontSize: '12px', color: '#6B625B'}}>{home.focus.label}</span>
                          <span style={{display: 'inline-flex', alignItems: 'center', height: '24px', padding: '0 10px', borderRadius: '999px', background: '#F5E8DC', color: '#9E5A22', fontSize: '12px', fontWeight: '500'}}>{home.focus.pill}</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          <div style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>{home.focus.name}</div>
                          <div style={{fontSize: '14px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{home.focus.line}</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div role='progressbar' aria-valuenow={home.focus.pctNum} aria-valuemin='0' aria-valuemax='100' aria-label='Progress to clearing' style={{height: '8px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#0A0908', borderRadius: '999px', width: home.focus.pct}}></div></div>
                          <div style={{fontSize: '12px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{home.focus.progress}</div>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #E8E1D8', paddingTop: '16px', gap: '16px'}}>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Projected clear</span><span style={{fontSize: '15px', fontWeight: '500', fontVariantNumeric: 'tabular-nums'}}>{home.focus.clear}</span></div>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Interest avoided</span><span style={{fontSize: '15px', fontWeight: '500', color: '#1F5C45', fontVariantNumeric: 'tabular-nums'}}>{home.focus.avoided}</span></div>
                        </div>
                        <div style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.5'}}>{home.focus.note}</div>
                        <button onClick={scrollQueue} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">See payoff plan</button>
                      </section>
                    </>) : null}

                    {(home.showSavings) ? (<>
                      <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <span style={{fontSize: '12px', color: '#6B625B'}}>What happens next</span>
                        <div style={{fontFamily: 'Fraunces', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>{home.savingsTitle}</div>
                        <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>{home.savingsText}</p>
                        <button onClick={go.ledger} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer', alignSelf: 'flex-start', padding: '0 16px'}} className="dc-h6">See the full payoff record</button>
                      </section>
                    </>) : null}

                    {(L.notDesk) ? (<>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                        <section aria-label='Agent status' style={{background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', border: `1px solid ${agent.frame}`}}>
                          <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', background: agent.frame, color: agent.fg}}>
                            <svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={agent.icon}></path></svg>
                            <span>{agent.state}</span><span style={{marginLeft: 'auto', fontWeight: '400', color: '#3D3733'}}>{agent.time}</span>
                          </div>
                          <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55'}}>{agent.text}</p>
                            <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                              <button onClick={agent.primaryOn} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>{agent.primary}</button>
                              {(agent.canResume) ? (<>
                                <button onClick={resumeAgent} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Resume anyway</button>
                              </>) : null}
                            </div>
                          </div>
                        </section>
                      </div>
                    </>) : null}

                    <section id='bt-queue' style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column'}}>
                      <div style={{padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', borderBottom: '1px solid #E8E1D8'}}>
                        <span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Payoff queue</span>
                        <span style={{fontSize: '12px', color: '#6B625B'}}>Highest rate first</span>
                      </div>
                      <ol style={{listStyle: 'none', margin: '0', padding: '0', overflowY: 'auto', maxHeight: L.queueMax}}>
                        {(home.queue).map((q, __i13) => (<React.Fragment key={__i13}>
                          <li style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', minHeight: '64px', boxSizing: 'border-box', borderBottom: '1px solid #F2EDE6', background: q.rowBg}} aria-current={q.cur}>
                            <span style={{width: '32px', height: '32px', borderRadius: '999px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#3D3733', boxSizing: 'border-box', border: `1px solid ${q.numBd}`, background: q.numBg}}>{q.n}</span>
                            <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}>
                              <span style={{fontSize: '15px'}}>{q.name}</span>
                              <span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums', textDecoration: q.strike}}>{q.detail}</span>
                            </span>
                            <span style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flex: 'none'}}>
                              <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500', boxSizing: 'border-box', background: q.pillBg, color: q.pillFg, border: `1px solid ${q.pillBd}`}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={q.pillIcon}></path></svg>{q.pill}</span>
                              <span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{q.when}</span>
                            </span>
                          </li>
                        </React.Fragment>))}
                      </ol>
                    </section>

                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 200px'}}>
                        <span style={{fontSize: '12px', color: '#6B625B'}}>{home.recycled.label}</span>
                        <span style={{fontFamily: 'Fraunces', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero'}}>{home.recycled.value}</span>
                        <span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.5'}}>{home.recycled.sub}</span>
                      </div>
                      {(home.recycled.hasChart) ? (<>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end'}}>
                          <div role='img' aria-label={home.recycled.chartAria} style={{display: 'flex', alignItems: 'flex-end', gap: '6px', height: '48px'}}>
                            {(home.recycled.bars).map((b, __i14) => (<React.Fragment key={__i14}>
                              <span style={{width: '20px', borderRadius: '3px', height: b.h, background: b.bg}}></span>
                            </React.Fragment>))}
                          </div>
                          <span style={{fontSize: '11px', color: '#6B625B'}}>{home.recycled.range}</span>
                        </div>
                      </>) : null}
                    </section>

                    {(L.notDesk) ? (<>
                      <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column'}}>
                        <div style={{padding: '16px', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', borderBottom: '1px solid #E8E1D8'}}>Recent activity</div>
                        {(hasActivity) ? (<>
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            {(activity).map((a, __i15) => (<React.Fragment key={__i15}>
                              <button onClick={a.on} style={{display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908', width: '100%'}} className="dc-h6">
                                <span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: a.iconBg, color: a.iconFg}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={a.icon}></path></svg></span>
                                <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.4'}}>{a.desc}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{a.rel}</span></span>
                                <span style={{fontSize: '14px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: a.amtColor}}>{a.amtShort}</span>
                              </button>
                            </React.Fragment>))}
                            <button onClick={go.ledger} style={{minHeight: '48px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}} className="dc-h6">View all<svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M6 4l4 4-4 4'></path></svg></button>
                          </div>
                        </>) : null}
                        {(noActivity) ? (<>
                          <div style={{padding: '24px 16px', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Nothing has moved yet. The first entry appears when member contributions are collected on {firstCollection}.</div>
                        </>) : null}
                      </section>
                    </>) : null}
                  </div>

                  {(L.isDesk) ? (<>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '80px', minWidth: '0'}}>
                      <section aria-label='Agent status' style={{background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', border: `1px solid ${agent.frame}`}}>
                        <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', background: agent.frame, color: agent.fg}}>
                          <svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={agent.icon}></path></svg>
                          <span>{agent.state}</span><span style={{marginLeft: 'auto', fontWeight: '400', color: '#3D3733'}}>{agent.time}</span>
                        </div>
                        <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                          <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55'}}>{agent.text}</p>
                          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                            <button onClick={agent.primaryOn} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>{agent.primary}</button>
                            {(agent.canResume) ? (<>
                              <button onClick={resumeAgent} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Resume anyway</button>
                            </>) : null}
                          </div>
                        </div>
                      </section>
                      <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column'}}>
                        <div style={{padding: '16px', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', borderBottom: '1px solid #E8E1D8'}}>Recent activity</div>
                        {(hasActivity) ? (<>
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            {(activity).map((a, __i16) => (<React.Fragment key={__i16}>
                              <button onClick={a.on} style={{display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908', width: '100%'}} className="dc-h6">
                                <span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: a.iconBg, color: a.iconFg}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={a.icon}></path></svg></span>
                                <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.4'}}>{a.desc}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{a.rel}</span></span>
                                <span style={{fontSize: '14px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: a.amtColor}}>{a.amtShort}</span>
                              </button>
                            </React.Fragment>))}
                            <button onClick={go.ledger} style={{minHeight: '48px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">View all</button>
                          </div>
                        </>) : null}
                        {(noActivity) ? (<>
                          <div style={{padding: '24px 16px', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Nothing has moved yet. The first entry appears when member contributions are collected on {firstCollection}.</div>
                        </>) : null}
                      </section>
                    </div>
                  </>) : null}
                </div>
              </div>
            </>) : null}

            {(r.homeMember) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0'}}><span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3'}}>{sv.name}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{mv.idLine}</span></div>
                <div style={{display: 'grid', gridTemplateColumns: L.homeCols, gap: '24px', alignItems: 'start'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '0'}}>
                    <section style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0'}}>
                      <div style={{fontSize: '12px', color: '#6B625B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500'}}>My debt remaining</div>
                      <button onClick={go.ledger} aria-label={`${mv.aria}. View ledger.`} style={{textAlign: 'left', border: 'none', background: 'transparent', padding: '0', cursor: 'pointer', fontFamily: 'Fraunces', fontOpticalSizing: 'auto', fontWeight: '400', lineHeight: '1.05', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums slashed-zero', color: '#0A0908', alignSelf: 'flex-start', fontSize: L.heroSize}}>{mv.bal}</button>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1F5C45', fontVariantNumeric: 'tabular-nums'}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M8 3v10M4 9l4 4 4-4'></path></svg><span>{mv.paid}</span></div>
                      <div style={{height: '8px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#C97B3C', borderRadius: '999px', width: mv.pct}}></div></div>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <span style={{fontSize: '12px', color: '#6B625B'}}>Your place in the queue</span>
                      <span style={{fontFamily: 'Fraunces', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{mv.position}</span>
                      <div role='img' aria-label={mv.positionAria} style={{display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: '4px'}}>
                        {(mv.steps).map((st, __i17) => (<React.Fragment key={__i17}><span style={{height: '6px', borderRadius: '999px', background: st.bg}}></span></React.Fragment>))}
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #E8E1D8', paddingTop: '12px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Projected clear</span><span style={{fontSize: '15px', fontWeight: '500'}}>{mv.clear}</span></div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Ahead of you</span><span style={{fontSize: '15px', fontWeight: '500'}}>{mv.ahead}</span></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.5'}}>{mv.aheadText}</span>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Your next contribution</span><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500', background: mv.mandBg, color: mv.mandFg}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={mv.mandIcon}></path></svg>{mv.mandLabel}</span></div>
                      <span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums'}}>{mv.next}</span>
                      <span style={{fontSize: '13px', color: '#3D3733'}}>{mv.history}</span>
                    </section>
                    <section style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                      <button onClick={go.ledger} style={{textAlign: 'left', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', color: '#0A0908'}} className="dc-h5"><span style={{fontSize: '12px', color: '#6B625B'}}>Group debt remaining</span><span style={{fontFamily: 'Fraunces', fontSize: '1.25rem', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{mv.groupDebt}</span></button>
                      <button onClick={go.ledger} style={{textAlign: 'left', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', color: '#0A0908'}} className="dc-h5"><span style={{fontSize: '12px', color: '#6B625B'}}>Group pool</span><span style={{fontFamily: 'Fraunces', fontSize: '1.25rem', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{mv.groupPool}</span></button>
                    </section>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '0'}}>
                    <section aria-label='Agent status' style={{background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', border: `1px solid ${agent.frame}`}}>
                      <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', background: agent.frame, color: agent.fg}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={agent.icon}></path></svg><span>{agent.state}</span><span style={{marginLeft: 'auto', fontWeight: '400', color: '#3D3733'}}>{agent.time}</span></div>
                      <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55'}}>{agent.text}</p>
                        <button onClick={go.agent} style={{alignSelf: 'flex-start', border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>See reasoning</button>
                      </div>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      <span style={{fontSize: '12px', color: '#6B625B'}}>{home.recycled.label}</span>
                      <span style={{fontFamily: 'Fraunces', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{home.recycled.value}</span>
                      <span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.5'}}>{home.recycled.sub}</span>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column'}}>
                      <div style={{padding: '16px', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', borderBottom: '1px solid #E8E1D8'}}>Recent activity</div>
                      {(activity).map((a, __i18) => (<React.Fragment key={__i18}>
                        <button onClick={a.on} style={{display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908', width: '100%'}} className="dc-h6">
                          <span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: a.iconBg, color: a.iconFg}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={a.icon}></path></svg></span>
                          <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.4'}}>{a.desc}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{a.rel}</span></span>
                          <span style={{fontSize: '14px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: a.amtColor}}>{a.amtShort}</span>
                        </button>
                      </React.Fragment>))}
                    </section>
                  </div>
                </div>
              </div>
            </>) : null}

            {(r.homeGrocery) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <button onClick={openSwitcher} style={{textAlign: 'left', border: 'none', background: 'transparent', padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0A0908', minHeight: '44px', alignSelf: 'flex-start'}}>
                  <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3'}}>{sv.name}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{gh.idLine}</span></span>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M4 6l4 4 4-4'></path></svg>
                </button>
                <div style={{display: 'grid', gridTemplateColumns: L.homeCols, gap: '24px', alignItems: 'start'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '0'}}>
                    <section style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0'}}>
                      <div style={{fontSize: '12px', color: '#6B625B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500'}}>Pool balance</div>
                      <button onClick={go.ledger} aria-label={`${gh.poolAria}. View ledger.`} style={{textAlign: 'left', border: 'none', background: 'transparent', padding: '0', cursor: 'pointer', fontFamily: 'Fraunces', fontOpticalSizing: 'auto', fontWeight: '400', lineHeight: '1.05', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums slashed-zero', color: '#0A0908', alignSelf: 'flex-start', fontSize: L.heroSize}}>{gh.pool}</button>
                      <span style={{alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: '28px', padding: '0 12px', borderRadius: '999px', background: '#E3EEE8', color: '#1F5C45', fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums'}}>{gh.added}</span>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px'}}>
                        <div role='progressbar' aria-valuenow={gh.pctNum} aria-valuemin='0' aria-valuemax='100' aria-label='Progress to payout target' style={{height: '8px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#0A0908', borderRadius: '999px', width: gh.pct}}></div></div>
                        <div style={{fontSize: '12px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{gh.progress}</div>
                      </div>
                    </section>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: L.statGap}}>
                      {(groceryStats).map((s, __i19) => (<React.Fragment key={__i19}>
                        <button onClick={go.ledger} style={{textAlign: 'left', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.statPad, display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', color: '#0A0908', minWidth: '0'}} className="dc-h5">
                          <span style={{fontSize: '12px', color: '#6B625B', lineHeight: '1.3'}}>{s.label}</span>
                          <span style={{fontFamily: 'Fraunces', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: L.statFig}}>{s.value}</span>
                          <span style={{fontSize: '12px', color: s.subColor}}>{s.sub}</span>
                        </button>
                      </React.Fragment>))}
                    </div>
                    <section aria-label='Agent status' style={{background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', border: `1px solid ${agent.frame}`}}>
                      <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', background: agent.frame, color: agent.fg}}>
                        <svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={agent.icon}></path></svg><span>{agent.state}</span><span style={{marginLeft: 'auto', fontWeight: '400', color: '#3D3733'}}>{agent.time}</span>
                      </div>
                      <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55'}}>{agent.text}</p>
                        <button onClick={go.agent} style={{alignSelf: 'flex-start', border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>See reasoning</button>
                      </div>
                    </section>
                  </div>
                  <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column', minWidth: '0'}}>
                    <div style={{padding: '16px', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', borderBottom: '1px solid #E8E1D8'}}>Recent activity</div>
                    {(activity).map((a, __i20) => (<React.Fragment key={__i20}>
                      <button onClick={a.on} style={{display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908', width: '100%'}} className="dc-h6">
                        <span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: a.iconBg, color: a.iconFg}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={a.icon}></path></svg></span>
                        <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.4'}}>{a.desc}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{a.rel}</span></span>
                        <span style={{fontSize: '14px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: a.amtColor}}>{a.amtShort}</span>
                      </button>
                    </React.Fragment>))}
                    <button onClick={go.ledger} style={{minHeight: '48px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">View all</button>
                  </section>
                </div>
              </div>
            </>) : null}

            {(r.agent) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '-12px'}}>
                  <button onClick={go.home} aria-label='Back to home' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button>
                  <h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Agent activity</h1>
                  <button onClick={openAgentRange} aria-label='Choose date range' style={{marginLeft: 'auto', width: '44px', height: '44px', border: '1px solid #948779', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908', position: 'relative'}} className="dc-h6"><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M2.5 4h11M4.5 8h7M6.5 12h3'></path></svg>{(agentRangeActive) ? (<><span style={{position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '999px', background: '#0A0908'}}></span></>) : null}</button>
                </div>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Every decision the agent makes for {sv.name}, with what it saw and why. Newest first.</p>
                <div role='radiogroup' aria-label='Filter decisions' style={{display: 'flex', padding: '4px', background: '#E8E1D8', borderRadius: '8px', gap: '4px', overflowX: 'auto'}}>
                  {(agentSegs).map((o, __i21) => (<React.Fragment key={__i21}>
                    <button role='radio' aria-checked={o.sel} onClick={o.on} style={{flex: '1 0 auto', height: '36px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', padding: '0 10px', transition: 'background 150ms', background: o.bg, color: o.fg, boxShadow: o.sh}}>{o.label}</button>
                  </React.Fragment>))}
                </div>
                {(hasDecisions) ? (<>
                  <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                    {(decisions).map((d, __i22) => (<React.Fragment key={__i22}>
                      <div style={{borderBottom: '1px solid #E8E1D8'}}>
                        <button onClick={d.toggle} aria-expanded={d.open} style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', minHeight: '68px', padding: '12px 16px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">
                          <span style={{width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: d.iconBg, color: d.iconFg}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={d.icon}></path></svg></span>
                          <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px', lineHeight: '1.45'}}>{d.summary}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{d.rel}</span></span>
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none', transition: 'transform 250ms cubic-bezier(0.2,0,0,1)', transform: d.chev}}><path d='M4 6l4 4 4-4'></path></svg>
                        </button>
                        {(d.open) ? (<>
                          <div style={{padding: '0 16px 20px 64px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'bt-fade 250ms cubic-bezier(0.2,0,0,1)'}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                              <div style={{fontSize: '12px', fontWeight: '600', color: '#3D3733', letterSpacing: '0.02em'}}>What I saw</div>
                              <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '8px'}}>
                                {(d.saw).map((kv, __i23) => (<React.Fragment key={__i23}>
                                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 12px', borderBottom: '1px solid #F2EDE6', fontSize: '13px', flexWrap: 'wrap'}}><span style={{color: '#6B625B'}}>{kv.k}</span><span style={{fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>{kv.v}</span></div>
                                </React.Fragment>))}
                              </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                              <div style={{fontSize: '12px', fontWeight: '600', color: '#3D3733', letterSpacing: '0.02em'}}>What I decided</div>
                              <p style={{margin: '0', fontSize: '1rem', lineHeight: '1.65', textWrap: 'pretty'}}>{d.decided}</p>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                              <div style={{fontSize: '12px', fontWeight: '600', color: '#3D3733', letterSpacing: '0.02em'}}>What happened</div>
                              <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>{d.happened}</p>
                              <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center'}}>
                                {(d.hasLedger) ? (<>
                                  <button onClick={d.openLedger} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>View ledger entry</button>
                                </>) : null}
                                {(d.hasArc) ? (<>
                                  <a href='#' onClick={preventNav} style={{fontSize: '14px', fontWeight: '500', display: 'inline-flex', gap: '6px', alignItems: 'center', minHeight: '44px'}}>Verify on Arc <span style={{fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#3D3733'}}>{d.arc}</span></a>
                                </>) : null}
                              </div>
                            </div>
                          </div>
                        </>) : null}
                      </div>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {(noDecisions) ? (<>
                  <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                    <span style={{width: '40px', height: '40px', borderRadius: '999px', border: '1px solid #E8E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733'}}><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true'><path d='M3 4h10M3 8h10M3 12h6'></path></svg></span>
                    <div style={{fontSize: '17px', fontWeight: '600'}}>{emptyDecTitle}</div>
                    <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>{emptyDecBody}</p>
                  </div>
                </>) : null}
              </div>
            </>) : null}

            {(r.ledger) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Ledger</h1>
                  <div style={{marginLeft: 'auto', display: 'flex', gap: '4px'}}>
                    <button onClick={openLedgerFilter} aria-label='Filter the ledger' style={{height: '44px', padding: '0 12px', border: '1px solid #948779', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6"><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M2.5 4h11M4.5 8h7M6.5 12h3'></path></svg>Filter</button>
                    <button onClick={exportCsv} aria-label='Export CSV' style={{height: '44px', padding: '0 12px', border: '1px solid #948779', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6"><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10'></path></svg>Export</button>
                  </div>
                </div>
                <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '12px', color: '#6B625B'}}>Pool balance</span>
                  <span aria-label={ledgerBalAria} style={{fontFamily: 'Fraunces', fontOpticalSizing: 'auto', fontSize: '2.25rem', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero'}}>{ledgerBal}</span>
                  <span style={{fontSize: '12px', color: '#6B625B'}}>{ledgerAsOf}</span>
                </section>
                {(ledgerFilterActive) ? (<>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#3D3733'}}><span>Showing {ledgerShown} · {ledgerFilterSummary}</span><button onClick={clearLedgerFilter} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Clear filter</button></div>
                </>) : null}
                {(hasLedger) ? (<>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {(L.isDesk) ? (<>
                      <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', overflow: 'hidden'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                          <thead>
                            <tr>
                              {(ledgerCols).map((c, __i24) => (<React.Fragment key={__i24}>
                                <th style={{position: 'sticky', top: '56px', background: '#FFFFFF', padding: '0', borderBottom: '1px solid #E8E1D8', textAlign: c.align}}>
                                  <button onClick={c.on} aria-sort={c.aria} style={{width: '100%', height: '44px', padding: '0 16px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: '500', color: '#3D3733', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: c.justify}} className="dc-h9">{c.label}<span aria-hidden='true' style={{fontSize: '10px', color: '#6B625B', width: '8px'}}>{c.arrow}</span></button>
                                </th>
                              </React.Fragment>))}
                            </tr>
                          </thead>
                          <tbody>
                            {(ledgerTable).map((e, __i25) => (<React.Fragment key={__i25}>
                              <tr onClick={e.on} style={{cursor: 'pointer'}} className="dc-h6">
                                <td style={{padding: '12px 16px', borderBottom: '1px solid #F2EDE6', color: '#3D3733', whiteSpace: 'nowrap'}}>{e.dateLong}</td>
                                <td style={{padding: '12px 16px', borderBottom: '1px solid #F2EDE6', color: '#3D3733'}}>{e.typeLabel}</td>
                                <td style={{padding: '12px 16px', borderBottom: '1px solid #F2EDE6'}}><span style={{display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>{e.desc}{(e.arc) ? (<><span title='Settled on Arc' aria-label='Settled on Arc' style={{display: 'inline-flex', color: '#3D3733'}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1'></path></svg></span></>) : null}{(e.failed) ? (<><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '22px', padding: '0 8px', borderRadius: '999px', background: '#F7E5E1', color: '#9C3A27', fontSize: '12px', fontWeight: '500'}}>Failed</span></>) : null}</span></td>
                                <td style={{padding: '12px 16px', borderBottom: '1px solid #F2EDE6', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: '500', color: e.amtColor}}>{e.amt}</td>
                                <td style={{padding: '12px 16px', borderBottom: '1px solid #F2EDE6', textAlign: 'right', whiteSpace: 'nowrap', color: '#3D3733'}}>{e.bal}</td>
                              </tr>
                            </React.Fragment>))}
                          </tbody>
                        </table>
                      </div>
                    </>) : null}
                    {(L.notDesk) ? (<>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {(ledgerGroups).map((g, __i26) => (<React.Fragment key={__i26}>
                          <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', overflow: 'hidden'}}>
                            <button onClick={g.toggle} aria-expanded={g.open} style={{width: '100%', minHeight: '48px', padding: '0 16px', border: 'none', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#0A0908', borderBottom: '1px solid #E8E1D8'}}>
                              <span style={{fontSize: '13px', fontWeight: '600'}}>{g.label}</span>
                              <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6B625B'}}>{g.count}<svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: g.chev}}><path d='M4 6l4 4 4-4'></path></svg></span>
                            </button>
                            {(g.open) ? (<>
                              <div style={{display: 'flex', flexDirection: 'column'}}>
                                {(g.rows).map((e, __i27) => (<React.Fragment key={__i27}>
                                  <button onClick={e.on} style={{display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%', minHeight: '64px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">
                                    <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                      <span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{e.dateShort} · {e.typeLabel}</span>
                                      <span style={{fontSize: '15px', lineHeight: '1.4', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>{e.desc}{(e.arc) ? (<><span title='Settled on Arc' aria-label='Settled on Arc' style={{display: 'inline-flex', color: '#3D3733'}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1'></path></svg></span></>) : null}{(e.failed) ? (<><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '22px', padding: '0 8px', borderRadius: '999px', background: '#F7E5E1', color: '#9C3A27', fontSize: '12px', fontWeight: '500'}}><svg width='11' height='11' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'><path d='M5 5l6 6M11 5l-6 6'></path></svg>Failed</span></>) : null}</span>
                                    </span>
                                    <span style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontVariantNumeric: 'tabular-nums', flex: 'none'}}>
                                      <span style={{fontSize: '15px', fontWeight: '500', color: e.amtColor}}>{e.amt}</span>
                                      <span style={{fontSize: '12px', color: '#6B625B'}}>{e.bal}</span>
                                    </span>
                                  </button>
                                </React.Fragment>))}
                              </div>
                            </>) : null}
                          </section>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
                {(noLedger) ? (<>
                  <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                    <span style={{width: '40px', height: '40px', borderRadius: '999px', border: '1px solid #E8E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733'}}><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M3.5 2.5h9v11h-9zM6 5.5h4M6 8h4M6 10.5h2.5'></path></svg></span>
                    <div style={{fontSize: '17px', fontWeight: '600'}}>The ledger is empty</div>
                    <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Every rand that moves will be recorded here, with the reason it moved. The first entries are the R500 joining contributions, once members approve their mandates.</p>
                  </div>
                </>) : null}
              </div>
            </>) : null}

            {(r.lend) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Lend</h1>
                  <span style={{fontSize: '12px', color: '#6B625B'}}>From {sv.name}'s pool</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: L.lendCols, gap: '24px', alignItems: 'start'}}>
                  <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0'}}>
                    <span style={{fontSize: '12px', color: '#6B625B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500'}}>Money you can lend safely</span>
                    <span aria-label={lend.lendableAria} style={{fontFamily: 'Fraunces', fontOpticalSizing: 'auto', lineHeight: '1.05', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums slashed-zero', fontSize: L.heroSize}}>{lend.lendable}</span>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}><span>Pool balance</span><span>{lend.pool}</span></div>
                      <div role='img' aria-label={lend.barAria} style={{display: 'flex', height: '12px', borderRadius: '999px', overflow: 'hidden', gap: '2px'}}>
                        <span style={{background: 'repeating-linear-gradient(135deg,#948779 0 1.5px,#FAF7F2 1.5px 5px)', width: lend.resW}}></span>
                        <span style={{background: 'repeating-linear-gradient(135deg,#6B625B 0 1.5px,#E8E1D8 1.5px 5px)', width: lend.oblW}}></span>
                        <span style={{background: '#6B625B', width: lend.lockedW}}></span>
                        <span style={{background: '#C97B3C', width: lend.lendW}}></span>
                      </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '10px', height: '10px', borderRadius: '2px', background: 'repeating-linear-gradient(135deg,#948779 0 1.5px,#FAF7F2 1.5px 4px)', border: '1px solid #E8E1D8'}}></span><span style={{flex: '1', color: '#3D3733'}}>Reserve floor · locked</span><span>{lend.reserve}</span></div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '10px', height: '10px', borderRadius: '2px', background: 'repeating-linear-gradient(135deg,#6B625B 0 1.5px,#E8E1D8 1.5px 4px)'}}></span><span style={{flex: '1', color: '#3D3733'}}>{lend.oblLabel} · locked</span><span>{lend.obl}</span></div>
                      {(lend.hasLoaned) ? (<><div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '10px', height: '10px', borderRadius: '2px', background: '#6B625B'}}></span><span style={{flex: '1', color: '#3D3733'}}>{lend.loanedText}</span><span></span></div></>) : null}
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '10px', height: '10px', borderRadius: '2px', background: '#C97B3C'}}></span><span style={{flex: '1', color: '#3D3733'}}>You can lend</span><span style={{fontWeight: '600'}}>{lend.lendable}</span></div>
                    </div>
                    <button onClick={openCalc} style={{alignSelf: 'flex-start', border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>How we calculate this</button>
                  </section>

                  <section style={{display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px'}}><h2 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Requests from other stokvels</h2></div>
                    {(hasReqs) ? (<>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        {(reqs).map((q, __i28) => (<React.Fragment key={__i28}>
                          <article style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                              <div style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                                <span style={{fontSize: '17px', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3'}}>{q.name}</span>
                                <span style={{alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: '24px', padding: '0 10px', borderRadius: '999px', background: '#FAF7F2', border: '1px solid #E8E1D8', color: '#3D3733', fontSize: '12px', fontWeight: '500', boxSizing: 'border-box'}}>{q.type}</span>
                              </div>
                              <button onClick={q.tipToggle} aria-expanded={q.tipOpen} aria-label={`${q.tierLabel}. What does this mean?`} style={{width: '44px', height: '44px', border: 'none', background: 'transparent', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-8px -8px 0 0'}}><span style={{width: '32px', height: '32px', borderRadius: '8px', fontFamily: 'Fraunces', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: q.tierBg, color: q.tierFg}}>{q.tier}</span></button>
                            </div>
                            {(q.tipOpen) ? (<><div role='tooltip' style={{background: '#0A0908', color: '#FAF7F2', borderRadius: '8px', padding: '12px', fontSize: '13px', lineHeight: '1.45'}}>{q.tip}</div></>) : null}
                            <div style={{fontSize: '15px', fontWeight: '500', fontVariantNumeric: 'tabular-nums'}}>{q.line}</div>
                            <div style={{fontSize: '13px', fontStyle: 'italic', color: '#6B625B', lineHeight: '1.45'}}>{q.note}</div>
                            <button onClick={q.on} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">Review</button>
                          </article>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    {(noReqs) ? (<>
                      <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '24px', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>No requests right now. When another stokvel asks to borrow, I'll assess them first and the request will appear here with my reasoning.</div>
                    </>) : null}
                  </section>

                  <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column', minWidth: '0'}}>
                    <div style={{padding: '16px 16px 0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Your loans</div>
                    <div role='tablist' style={{display: 'flex', gap: '24px', padding: '0 16px', borderBottom: '1px solid #E8E1D8'}}>
                      {(lendTabs).map((t, __i29) => (<React.Fragment key={__i29}>
                        <button role='tab' aria-selected={t.sel} onClick={t.on} style={{height: '44px', padding: '0', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: t.fg, boxShadow: `inset 0 -2px 0 ${t.bar}`, transition: 'color 150ms'}}>{t.label}</button>
                      </React.Fragment>))}
                    </div>
                    {(hasLoans) ? (<>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        {(loans).map((l, __i30) => (<React.Fragment key={__i30}>
                          <div style={{padding: '16px', borderBottom: '1px solid #F2EDE6', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px'}}>
                              <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px'}}>{l.name}</span><span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{l.line}</span></span>
                              <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500', flex: 'none', background: l.pillBg, color: l.pillFg}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={l.pillIcon}></path></svg>{l.pill}</span>
                            </div>
                            <div style={{height: '6px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#0A0908', borderRadius: '999px', width: l.pct}}></div></div>
                            <span style={{fontSize: '12px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{l.progress}</span>
                          </div>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    {(noLoans) ? (<><div style={{padding: '24px 16px', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>{emptyLoansText}</div></>) : null}
                  </section>
                </div>
              </div>
            </>) : null}

            {(r.lendOff) ? (<>
              <div style={{maxWidth: '560px', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                <span style={{width: '40px', height: '40px', borderRadius: '999px', border: '1px solid #E8E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733'}}><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M2.5 5.5h9L9 3M13.5 10.5h-9L7 13'></path></svg></span>
                <div style={{fontSize: '17px', fontWeight: '600'}}>Lending is off for {sv.name}</div>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Its constitution sends everything above the reserve floor to the payoff queue. Clearing a 24% store card beats any loan rate other stokvels offer.</p>
                <button onClick={switchToGrocery} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">Lend from Soweto Grocery Club</button>
              </div>
            </>) : null}

            {(r.lendDenied) ? (<>
              <div style={{maxWidth: '560px', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                <span style={{width: '40px', height: '40px', borderRadius: '999px', border: '1px solid #E8E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733'}}><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M4 7.5h8v6H4zM5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2'></path></svg></span>
                <div style={{fontSize: '17px', fontWeight: '600'}}>Lending is for the treasurer</div>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Only the treasurer can review loan requests. Ask {treasurerFirst} to share the reasoning if you're curious. Every loan decision also appears in the ledger.</p>
                <button onClick={go.home} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">Back to Home</button>
              </div>
            </>) : null}

            {(r.loan) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '-12px'}}>
                  <button onClick={go.lend} aria-label='Back to Lend' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button>
                  <span style={{fontSize: '15px', fontWeight: '500', color: '#3D3733'}}>Loan request</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: L.loanCols, gap: '16px', alignItems: 'start'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0'}}>
                    <section style={{display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0'}}>
                      <h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>{loan.name}</h1>
                      <span style={{fontSize: '13px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{loan.idLine}</span>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', padding: L.cardPad, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <span style={{fontSize: '12px', color: '#6B625B'}}>They're asking for</span>
                      <span style={{fontFamily: 'Fraunces', fontSize: '2.25rem', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero'}}>{loan.amountText}</span>
                      <span style={{fontSize: '15px', color: '#3D3733'}}>{loan.termLine}</span>
                      <div style={{borderTop: '1px solid #E8E1D8', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px'}}><span style={{fontSize: '12px', color: '#6B625B'}}>Purpose, in their words</span><span style={{fontSize: '15px', lineHeight: '1.5'}}>{loan.purpose}</span></div>
                    </section>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '12px', color: '#6B625B', paddingBottom: '8px'}}>Terms</span>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minHeight: '44px', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Escrow address</span><button onClick={copyEscrow} style={{border: 'none', background: 'transparent', padding: '0 0 0 8px', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#0A0908'}}>{loan.escrow}<svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3'></path></svg></button></div>
                      <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Paid in</span><span>USDC on Arc</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Money arrives</span><span>Within 1 hour of approval</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}><span style={{color: '#3D3733'}}>Repayment due</span><span>{loan.due}</span></div>
                    </section>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0'}}>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.04)', display: 'flex', flexDirection: 'column'}}>
                      <div style={{padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E8E1D8', textAlign: 'center'}}>
                        <span style={{fontSize: '12px', color: '#6B625B'}}>Credit assessment</span>
                        <span style={{width: '64px', height: '64px', borderRadius: '12px', fontFamily: 'Fraunces', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: loan.tierBg, color: loan.tierFg}}>{loan.tier}</span>
                        <span style={{fontSize: '15px', fontWeight: '600'}}>{loan.tierLabel}</span>
                        <span style={{fontSize: '13px', color: '#3D3733', lineHeight: '1.45', maxWidth: '360px'}}>{loan.tierTip}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: '1px solid #F2EDE6', flexWrap: 'wrap'}}>
                        <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px'}}>Contribution consistency</span><span style={{fontSize: '12px', color: '#6B625B'}}>{loan.recordText}</span></span>
                        <div role='img' aria-label={loan.recordText} style={{display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px'}}>
                          {(loan.bars).map((b, __i31) => (<React.Fragment key={__i31}><span style={{width: '7px', borderRadius: '2px', boxSizing: 'border-box', height: b.h, background: b.bg, border: `1.5px solid ${b.bd}`}}></span></React.Fragment>))}
                        </div>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: '1px solid #F2EDE6', flexWrap: 'wrap'}}>
                        <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px'}}>Tenure</span><span style={{fontSize: '12px', color: '#6B625B'}}>{loan.tenureText}</span></span>
                        <div style={{width: '120px', height: '6px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#0A0908', width: loan.tenureW}}></div></div>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: '1px solid #F2EDE6', flexWrap: 'wrap'}}>
                        <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px'}}>Member count</span><span style={{fontSize: '12px', color: '#6B625B'}}>{loan.members} members</span></span>
                        <div aria-hidden='true' style={{display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '120px', justifyContent: 'flex-end'}}>{(loan.dots).map((d, __i32) => (<React.Fragment key={__i32}><span style={{width: '6px', height: '6px', borderRadius: '999px', background: '#3D3733'}}></span></React.Fragment>))}</div>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: '1px solid #F2EDE6', flexWrap: 'wrap'}}>
                        <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px'}}>Repayment history</span><span style={{fontSize: '12px', color: '#6B625B'}}>{loan.repayText}</span></span>
                        <div aria-hidden='true' style={{display: 'flex', gap: '4px'}}>{(loan.checks).map((c, __i33) => (<React.Fragment key={__i33}><span style={{width: '18px', height: '18px', borderRadius: '999px', background: '#E3EEE8', color: '#1F5C45', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width='10' height='10' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M3.5 8.5l3 3 6-7'></path></svg></span></React.Fragment>))}</div>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 16px', flexWrap: 'wrap'}}>
                        <span style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px'}}>Reserve health</span><span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{loan.resText}</span></span>
                        <div aria-hidden='true' style={{width: '120px', display: 'flex', flexDirection: 'column', gap: '4px'}}><div style={{height: '6px', borderRadius: '999px', background: '#1F5C45', width: loan.resBalW}}></div><div style={{height: '6px', borderRadius: '999px', background: 'repeating-linear-gradient(135deg,#948779 0 1.5px,#E8E1D8 1.5px 4px)', width: loan.resFloorW}}></div></div>
                      </div>
                    </section>
                    <section style={{background: '#FAF7F2', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      <span style={{fontSize: '12px', fontWeight: '600', color: '#3D3733'}}>{loan.reasonLabel}</span>
                      <p style={{margin: '0', fontSize: '1rem', lineHeight: '1.7', textWrap: 'pretty'}}>{loan.reasoning}</p>
                    </section>
                    <div style={{position: 'sticky', zIndex: '3', bottom: L.stickyBottom, background: '#FAF7F2', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #E8E1D8'}}>
                      <button onClick={openApprove} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3 dc-a10">{loan.approveLabel}</button>
                      <button onClick={openDecline} style={{height: '44px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#3D3733', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h1">Decline</button>
                    </div>
                  </div>
                </div>
              </div>
            </>) : null}

            {(r.members) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}><h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Members</h1><span style={{fontSize: '12px', color: '#6B625B'}}>{memberCount} in {sv.name}</span></div>
                  {(isTreasurer) ? (<>
                    <button onClick={goInvite} style={{marginLeft: 'auto', height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}} className="dc-h0"><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' aria-hidden='true'><path d='M8 3v10M3 8h10'></path></svg>Invite</button>
                  </>) : null}
                </div>
                {(hasRosterBanner) ? (<>
                  <div role='alert' style={{background: '#F7E5E1', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', lineHeight: '1.45'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#9C3A27' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M6 6l4 4M10 6l-4 4'></path></svg><span>{rosterBanner}</span></div>
                </>) : null}
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                  {(roster).map((m, __i34) => (<React.Fragment key={__i34}>
                    <button onClick={m.on} disabled={isMemberRole} style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', minHeight: '72px', padding: '12px 16px', border: 'none', borderBottom: '1px solid #F2EDE6', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">
                      <span style={{width: '48px', height: '48px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#0A0908', flex: 'none', border: '1px solid #E8E1D8', boxSizing: 'border-box', background: m.avBg}}>{m.ini}</span>
                      <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px'}}>{m.name}</span><span style={{fontSize: '12px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{m.sub}</span></span>
                      <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500', flex: 'none', boxSizing: 'border-box', background: m.pillBg, color: m.pillFg, border: `1px solid ${m.pillBd}`}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={m.pillIcon}></path></svg>{m.pill}</span>
                    </button>
                  </React.Fragment>))}
                </div>
                {(isMemberRole) ? (<><span style={{fontSize: '12px', color: '#6B625B'}}>Mandate statuses are visible to every member. Only the treasurer can change them.</span></>) : null}
              </div>
            </>) : null}

            {(r.member) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '960px'}}>
                <div style={{marginLeft: '-12px'}}><button onClick={go2.members} aria-label='Back to Members' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <span style={{width: '64px', height: '64px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '600', flex: 'none', border: '1px solid #E8E1D8', boxSizing: 'border-box', background: member.avBg}}>{member.ini}</span>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0'}}><h1 style={{margin: '0', fontFamily: 'Fraunces', fontWeight: '400', fontSize: '1.75rem', lineHeight: '1.15', letterSpacing: '-0.02em'}}>{member.name}</h1><span style={{fontSize: '13px', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{member.roleLine}</span></div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: L.twoCols, gap: '16px', alignItems: 'start'}}>
                  <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <span style={{fontSize: '15px', fontWeight: '600'}}>Contributions</span>
                    {(member.emptyHist) ? (<><span style={{fontSize: '13px', lineHeight: '1.5', color: '#3D3733'}}>{member.emptyHistText}</span></>) : null}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: '6px'}}>
                      {(member.history).map((h, __i35) => (<React.Fragment key={__i35}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                          <span style={{width: '100%', aspectRatio: '1', maxWidth: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', background: h.bg, color: h.fg, border: `1px solid ${h.bd}`}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={h.icon}></path></svg></span>
                          <span style={{fontSize: '11px', color: '#3D3733'}}>{h.label}</span>
                          <span style={{fontSize: '10px', color: '#6B625B', textAlign: 'center', lineHeight: '1.2'}}>{h.text}</span>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </section>
                  <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column'}}>
                    <span style={{fontSize: '15px', fontWeight: '600', paddingBottom: '8px'}}>DebiCheck mandate</span>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minHeight: '44px', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Status</span><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500', boxSizing: 'border-box', background: member.pillBg, color: member.pillFg, border: `1px solid ${member.pillBd}`}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={member.pillIcon}></path></svg>{member.pill}</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minHeight: '44px', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Mandate ID</span><button onClick={copyEscrow} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', color: '#0A0908'}}>{member.mandId}<svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3'></path></svg></button></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>Created</span><span>{member.mandCreated}</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}><span style={{color: '#3D3733'}}>Debit</span><span>{member.amount}</span></div>
                  </section>
                  {(member.hasDebt) ? (<>
                    <section style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '15px', fontWeight: '600', paddingBottom: '8px'}}>Debt and queue</span>
                      {(member.debtRows).map((kv, __i36) => (<React.Fragment key={__i36}>
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '44px', alignItems: 'center', borderTop: '1px solid #F2EDE6', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}><span style={{color: '#3D3733'}}>{kv.k}</span><span style={{textAlign: 'right'}}>{kv.v}</span></div>
                      </React.Fragment>))}
                    </section>
                  </>) : null}
                  {(member.canAct) ? (<>
                    <section style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      <button onClick={openEditAmt} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">Edit contribution</button>
                      <button onClick={member.togglePause} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">{member.pauseLabel}</button>
                      <button onClick={openRemove} style={{height: '44px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#9C3A27', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h11">Remove member</button>
                    </section>
                  </>) : null}
                </div>
              </div>
            </>) : null}

            {(r.invite) ? (<>
              <div style={{maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '-12px'}}>
                  <button onClick={go2.members} aria-label='Back to Members' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0908'}} className="dc-h2"><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M10 4L6 8l4 4'></path></svg></button>
                  <h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Invite a member</h1>
                </div>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3D3733'}}>They'll receive an SMS with a link to authenticate their mandate with their bank.</p>
                <p style={{margin: '0', fontSize: '13px', lineHeight: '1.55', color: '#6B625B'}}>The DebiCheck mandate only allows the agreed amount on the agreed date. They can cancel it with their bank at any time, and you'll be told if they do. Their information is handled under the privacy notice they accept when they join.</p>
                <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Full name</span>
                  <input value={inv.name} onChange={setInvName} placeholder='e.g. Nomvula Zulu' style={{height: '48px', borderRadius: '8px', background: '#FFFFFF', padding: '0 16px', fontSize: '15px', color: '#0A0908', outline: 'none', boxSizing: 'border-box', border: `1px solid ${invNameBd}`}} className="dc-f4" />
                  {(invNameErr) ? (<><span style={{fontSize: '12px', color: '#9C3A27'}}>Enter their name as it appears on their ID, so their bank can match the mandate.</span></>) : null}
                </label>
                <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Phone number</span>
                  <input inputMode='tel' value={inv.phone} onChange={setInvPhone} placeholder='082 555 0134' style={{height: '48px', borderRadius: '8px', background: '#FFFFFF', padding: '0 16px', fontSize: '15px', color: '#0A0908', outline: 'none', boxSizing: 'border-box', fontVariantNumeric: 'tabular-nums', border: `1px solid ${invPhoneBd}`}} className="dc-f4" />
                  {(invPhoneErr) ? (<><span style={{fontSize: '12px', color: '#9C3A27'}}>Enter all 10 digits, starting with 0. We send the mandate link here.</span></>) : null}
                </label>
                <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Contribution</span>
                  <span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={inv.amount} onChange={setInvAmount} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span>
                </label>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#6B625B'}}>Frequency</span>
                  <span style={{height: '48px', borderRadius: '8px', border: '1px solid #E8E1D8', background: '#FAF7F2', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '15px', color: '#3D3733', boxSizing: 'border-box'}}>{baseFreq}</span>
                </div>
                {(invFailed) ? (<>
                  <div role='alert' style={{background: '#F7E5E1', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', lineHeight: '1.45'}}>
                    <span style={{display: 'flex', gap: '12px'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#9C3A27' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M6 6l4 4M10 6l-4 4'></path></svg><span><b style={{fontWeight: '600'}}>We couldn't send the SMS to {invFailNum}.</b> The phone may be off or out of coverage. Nothing was saved. Try again, or share the invite link on WhatsApp instead.</span></span>
                    <button onClick={shareInviteWa} style={{alignSelf: 'flex-start', marginLeft: '28px', height: '36px', padding: '0 12px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}}>Copy link for WhatsApp</button>
                  </div>
                </>) : null}
                <button onClick={sendInvite} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Send invite</button>
              </div>
            </>) : null}

            {(r.inviteSent) ? (<>
              <div style={{maxWidth: '560px', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                <span style={{width: '44px', height: '44px', borderRadius: '999px', background: '#E3EEE8', color: '#1F5C45', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width='20' height='20' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M3.5 8.5l3 3 6-7'></path></svg></span>
                <div style={{fontSize: '20px', fontWeight: '600', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums'}}>Invitation sent to {invSentTo}</div>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>{invSentName} will appear as Pending until they approve the mandate with their bank. The invitation is in the ledger.</p>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px'}}>
                  <button onClick={go2.members} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h0">Back to Members</button>
                  <button onClick={goInvite} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">Invite another</button>
                </div>
              </div>
            </>) : null}

            {(r.settings) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}><h1 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em'}}>Stokvel settings</h1><span style={{fontSize: '13px', color: '#3D3733'}}>{sv.name}'s constitution. Every change is written to the ledger.</span></div>
                {(setFailed) ? (<>
                  <div role='alert' style={{background: '#F7E5E1', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '12px', fontSize: '13px', lineHeight: '1.5', alignItems: 'flex-start'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#9C3A27' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2.5l6 11H2zM8 7v2.5M8 11.5v.01'></path></svg><span style={{flex: '1'}}><b style={{fontWeight: '600'}}>Your change wasn't saved.</b> We couldn't reach the server, so the constitution is unchanged and nothing was logged. Your edit is still in the form; press Save again.</span><button onClick={dismissSetFailed} aria-label='Dismiss' style={{width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#3D3733', margin: '-6px -8px 0 0'}}>✕</button></div>
                </>) : null}
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>

                  <div style={{borderBottom: '1px solid #E8E1D8'}}>
                    <button onClick={settings.secs.basics.toggle} aria-expanded={settings.secs.basics.open} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>{settings.secs.basics.label}</span><span style={{fontSize: '13px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{settings.secs.basics.sum}</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: settings.secs.basics.chev}}><path d='M4 6l4 4 4-4'></path></svg></button>
                    {(settings.secs.basics.open) ? (<>
                      <div style={{padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px', flexWrap: 'wrap'}}><span style={{color: '#3D3733'}}>Name</span><span>{sv.name}</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '14px', flexWrap: 'wrap'}}><span style={{color: '#3D3733'}}>Type</span><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>{settings.typeLabel}<button onClick={typeRequest} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>Request a change</button></span></div>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Contribution per member</span><span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={settings.dr.amount} onChange={settings.setAmount} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span><span style={{fontSize: '12px', color: '#6B625B'}}>Monthly, on the 1st. Each member re-approves a changed amount with their bank.</span></label>
                        {(settings.basicsDirty) ? (<><button onClick={settings.saveBasics} style={{alignSelf: 'flex-start', height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Save change</button></>) : null}
                      </div>
                    </>) : null}
                  </div>

                  <div style={{borderBottom: '1px solid #E8E1D8'}}>
                    <button onClick={settings.secs.reserve.toggle} aria-expanded={settings.secs.reserve.open} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>{settings.secs.reserve.label}</span><span style={{fontSize: '13px', color: '#6B625B', fontVariantNumeric: 'tabular-nums'}}>{settings.secs.reserve.sum}</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: settings.secs.reserve.chev}}><path d='M4 6l4 4 4-4'></path></svg></button>
                    {(settings.secs.reserve.open) ? (<>
                      <div style={{padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Money the group never pays out or lends. The agent checks this before every payment, so one late contribution can't stop the plan.</p>
                        <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Reserve floor</span><span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={settings.dr.reserve} onChange={settings.setReserve} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span></label>
                        {(settings.reserveDirty) ? (<><button onClick={settings.saveReserve} style={{alignSelf: 'flex-start', height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Save change</button></>) : null}
                      </div>
                    </>) : null}
                  </div>

                  <div style={{borderBottom: '1px solid #E8E1D8'}}>
                    <button onClick={settings.secs.queue.toggle} aria-expanded={settings.secs.queue.open} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>{settings.secs.queue.label}</span><span style={{fontSize: '13px', color: '#6B625B'}}>{settings.secs.queue.sum}</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: settings.secs.queue.chev}}><path d='M4 6l4 4 4-4'></path></svg></button>
                    {(settings.secs.queue.open) ? (<>
                      <div style={{padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        {(settings.isDebt) ? (<>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>The order follows interest rate, highest first, as members agreed when they joined. Changing it needs a vote.</p>
                            <div style={{border: '1px solid #E8E1D8', borderRadius: '8px'}}>
                              {(settings.queue).map((a, __i37) => (<React.Fragment key={__i37}><div style={{display: 'flex', gap: '12px', padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid #F2EDE6', fontVariantNumeric: 'tabular-nums'}}><span style={{fontFamily: '\'JetBrains Mono\',monospace', color: '#6B625B', width: '20px'}}>{a.n}</span><span style={{flex: '1'}}>{a.name}</span><span style={{color: '#3D3733'}}>{a.rate}</span></div></React.Fragment>))}
                            </div>
                            <button onClick={voteRequest} style={{alignSelf: 'flex-start', height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6">Ask members to vote</button>
                          </div>
                        </>) : null}
                        {(isGroceryStk) ? (<><p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>{settings.payoutText}</p></>) : null}
                      </div>
                    </>) : null}
                  </div>

                  {(settings.isDebt) ? (<>
                    <div style={{borderBottom: '1px solid #E8E1D8'}}>
                      <button onClick={settings.secs.recycling.toggle} aria-expanded={settings.secs.recycling.open} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>{settings.secs.recycling.label}</span><span style={{fontSize: '13px', color: '#6B625B'}}>{settings.secs.recycling.sum}</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: settings.secs.recycling.chev}}><path d='M4 6l4 4 4-4'></path></svg></button>
                      {(settings.secs.recycling.open) ? (<>
                        <div style={{padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                          <button role='switch' aria-checked={settings.dr.recycle} onClick={settings.toggleRec} style={{display: 'flex', gap: '16px', alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 'none', padding: '0', cursor: 'pointer', color: '#0A0908', minHeight: '44px'}}>
                            <span style={{flex: '1', fontSize: '14px', lineHeight: '1.5'}}>Cleared members redirect their minimum into the pool</span>
                            <span style={{width: '44px', height: '26px', borderRadius: '999px', flex: 'none', position: 'relative', transition: 'background 150ms', background: settings.recTrack}}><span style={{position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', transition: 'left 150ms cubic-bezier(0.2,0,0,1)', left: settings.recKnob}}></span></span>
                          </button>
                          <div style={{display: 'flex', padding: '4px', background: '#E8E1D8', borderRadius: '8px', gap: '4px'}}>
                            {(settings.pctSegs).map((o, __i38) => (<React.Fragment key={__i38}><button onClick={o.on} aria-pressed={o.sel} style={{flex: '1', height: '40px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: o.bg, color: o.fg, boxShadow: o.sh}}>{o.label}</button></React.Fragment>))}
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', height: '48px', border: '1px solid #948779', borderRadius: '8px', background: '#FFFFFF', overflow: 'hidden'}}>
                            <button onClick={settings.graceDown} aria-label='Fewer months' style={{width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#0A0908'}}>−</button>
                            <span style={{flex: '1', textAlign: 'center', fontSize: '15px'}}>Grace: {settings.graceText}</span>
                            <button onClick={settings.graceUp} aria-label='More months' style={{width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#0A0908'}}>+</button>
                          </div>
                          {(settings.recyclingDirty) ? (<>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                              <div role='alert' style={{background: '#F7EEDC', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', lineHeight: '1.45', display: 'flex', gap: '12px'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#84591A' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2.5l6 11H2zM8 7v2.5M8 11.5v.01'></path></svg><span>Changing recycling rules affects every cleared member going forward. Existing agreements remain in place.</span></div>
                              <button onClick={settings.saveRecycling} style={{alignSelf: 'flex-start', height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Save changes</button>
                            </div>
                          </>) : null}
                        </div>
                      </>) : null}
                    </div>
                  </>) : null}

                  <button onClick={go2.members} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', borderBottom: '1px solid #E8E1D8', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>Members</span><span style={{fontSize: '13px', color: '#6B625B'}}>{settings.secs.members.sum}</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#3D3733' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M6 4l4 4-4 4'></path></svg></button>

                  <div>
                    <button onClick={settings.secs.danger.toggle} aria-expanded={settings.secs.danger.open} style={{width: '100%', minHeight: '56px', padding: '0 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#9C3A27', textAlign: 'left'}} className="dc-h6"><span style={{flex: '1', fontSize: '15px', fontWeight: '500'}}>Danger zone</span><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{transform: settings.secs.danger.chev}}><path d='M4 6l4 4 4-4'></path></svg></button>
                    {(settings.secs.danger.open) ? (<>
                      <div style={{padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Dissolving sends a proposal to every member. If 7 in 10 approve, the pool is returned under rule 4 of the constitution. Type the stokvel's name to continue.</p>
                        <input value={dissolveText} onChange={setDissolve} placeholder={sv.name} aria-label='Type the stokvel name to confirm' style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', padding: '0 16px', fontSize: '15px', color: '#0A0908', outline: 'none', boxSizing: 'border-box'}} className="dc-f4" />
                        <button onClick={dissolve} disabled={settings.dissolveDisabled} style={{alignSelf: 'flex-start', height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer', background: settings.dissolveBg, color: settings.dissolveFg}}>Propose dissolving</button>
                      </div>
                    </>) : null}
                  </div>
                </div>
              </div>
            </>) : null}

            {(r.skelHome) ? (<>
              <div aria-busy='true' aria-label='Loading dashboard' style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{height: '20px', width: '55%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '12px', width: '40%', borderRadius: '4px', background: '#EFE9E1'}}></span></div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0'}}><span style={{height: '12px', width: '30%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '44px', width: '70%', borderRadius: '8px', background: '#EFE9E1'}}></span><span style={{height: '14px', width: '50%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '8px', width: '100%', borderRadius: '999px', background: '#EFE9E1'}}></span></div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px'}}><span style={{height: '76px', borderRadius: '12px', background: '#EFE9E1'}}></span><span style={{height: '76px', borderRadius: '12px', background: '#EFE9E1'}}></span><span style={{height: '76px', borderRadius: '12px', background: '#EFE9E1'}}></span></div>
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}><span style={{height: '12px', width: '35%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '20px', width: '50%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '8px', width: '100%', borderRadius: '999px', background: '#EFE9E1'}}></span><span style={{height: '44px', width: '100%', borderRadius: '8px', background: '#EFE9E1'}}></span></div>
                <div style={{background: '#FFFFFF', border: '1px solid #F5E8DC', borderRadius: '12px', overflow: 'hidden'}}><div style={{height: '32px', background: '#F5E8DC'}}></div><div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{height: '14px', width: '90%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '14px', width: '70%', borderRadius: '4px', background: '#EFE9E1'}}></span></div></div>
              </div>
            </>) : null}
            {(r.skelList) ? (<>
              <div aria-busy='true' aria-label='Loading' style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px'}}>
                <span style={{height: '20px', width: '30%', borderRadius: '4px', background: '#EFE9E1'}}></span>
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{height: '12px', width: '25%', borderRadius: '4px', background: '#EFE9E1'}}></span><span style={{height: '36px', width: '50%', borderRadius: '8px', background: '#EFE9E1'}}></span></div>
                <div style={{background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', display: 'flex', flexDirection: 'column'}}>
                  {(skelRows).map((k, __i39) => (<React.Fragment key={__i39}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', minHeight: '68px', padding: '12px 16px', borderBottom: '1px solid #F2EDE6', boxSizing: 'border-box'}}><span style={{width: '40px', height: '40px', borderRadius: '999px', background: '#EFE9E1', flex: 'none'}}></span><span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{height: '12px', borderRadius: '4px', background: '#EFE9E1', width: k.w}}></span><span style={{height: '10px', width: '30%', borderRadius: '4px', background: '#EFE9E1'}}></span></span><span style={{height: '14px', width: '64px', borderRadius: '4px', background: '#EFE9E1'}}></span></div>
                  </React.Fragment>))}
                </div>
              </div>
            </>) : null}
            {(r.errorOn) ? (<>
              <div role='alert' style={{maxWidth: '560px', background: '#FFFFFF', border: '1px solid #E8E1D8', borderRadius: '12px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start'}}>
                <span style={{width: '40px', height: '40px', borderRadius: '999px', background: '#F7E5E1', color: '#9C3A27', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M8 2.5l6 11H2zM8 7v2.5M8 11.5v.01'></path></svg></span>
                <div style={{fontSize: '17px', fontWeight: '600'}}>{errTitle}</div>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>The connection timed out after 20 seconds. Your money hasn't moved; only this screen failed to load. If you're on mobile data, try again in a moment.</p>
                <button onClick={retry} style={{height: '44px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h0">Try again</button>
              </div>
            </>) : null}


          </main>
        </div>
      </div>

      {(L.isMobile) ? (<>
        <nav aria-label='Primary' style={{position: 'absolute', left: '0', right: '0', bottom: '0', zIndex: '6', background: '#FFFFFF', borderTop: '1px solid #E8E1D8', display: 'grid', gridTemplateColumns: L.tabCols, paddingBottom: 'env(safe-area-inset-bottom)'}}>
          {(tabItems).map((n, __i40) => (<React.Fragment key={__i40}>
            <button onClick={n.on} aria-current={n.cur} style={{height: '64px', border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '500', color: n.fg, boxShadow: `inset 0 2px 0 ${n.bar}`}}>
              <svg width='22' height='22' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={n.icon}></path></svg>{n.label}
            </button>
          </React.Fragment>))}
        </nav>
      </>) : null}
    </>) : null}

    {(sheetOpen) ? (<>
      <div style={{position: 'absolute', inset: '0', zIndex: '20'}}>
        <div onClick={closeSheet} style={{position: 'absolute', inset: '0', background: 'rgba(10,9,8,0.32)', animation: 'bt-fade 250ms cubic-bezier(0.2,0,0,1)'}}></div>
        <div role='dialog' aria-modal='true' aria-label={sheetTitle} style={{position: 'absolute', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(10,9,8,0.06),0 8px 24px rgba(10,9,8,0.06)', display: 'flex', flexDirection: 'column', maxHeight: '85%', overflowY: 'auto', animation: L.sAnim, transform: L.sTf, left: L.sL, right: L.sR, bottom: L.sB, top: L.sT, width: L.sW, margin: L.sM, borderRadius: L.sRad}}>
          <div style={{padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {(L.isMobile) ? (<><div style={{width: '36px', height: '4px', borderRadius: '999px', background: '#E8E1D8', alignSelf: 'center'}}></div></>) : null}
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px', paddingTop: '8px'}}>
              <div style={{flex: '1', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3'}}>{sheetTitle}</div>
              <button onClick={closeSheet} aria-label='Close' style={{width: '44px', height: '44px', margin: '-10px -10px 0 0', border: 'none', background: 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733'}} className="dc-h2"><svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true'><path d='M4 4l8 8M12 4l-8 8'></path></svg></button>
            </div>

            {(sh.switcher) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {(switcherRows).map((s, __i41) => (<React.Fragment key={__i41}>
                  <button onClick={s.on} disabled={s.disabled} style={{textAlign: 'left', minHeight: '64px', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#0A0908', background: s.bg, border: `1.5px solid ${s.bd}`}}>
                    <span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '15px', fontWeight: '500'}}>{s.name}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{s.sub}</span></span>
                    <span style={{fontSize: '12px', color: '#3D3733'}}>{s.tag}</span>
                  </button>
                </React.Fragment>))}
              </div>
            </>) : null}

            {(sh.stat) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <span style={{fontFamily: 'Fraunces', fontSize: '2.25rem', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero', color: stat.color}}>{stat.value}</span>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.6'}}>{stat.body}</p>
                <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '8px'}}>
                  {(stat.rows).map((kv, __i42) => (<React.Fragment key={__i42}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6', fontSize: '13px'}}><span style={{color: '#3D3733'}}>{kv.k}</span><span style={{fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: kv.w}}>{kv.v}</span></div>
                  </React.Fragment>))}
                </div>
                <button onClick={go.ledger} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">See the ledger entries</button>
              </div>
            </>) : null}

            {(sh.entry) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <span style={{fontFamily: 'Fraunces', fontSize: '2.25rem', lineHeight: '1.1', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums slashed-zero', color: entry.amtColor}}>{entry.amt}</span>
                  <span style={{fontSize: '13px', color: '#3D3733'}}>{entry.typeLabel}</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '8px'}}>
                  {(entry.rows).map((kv, __i43) => (<React.Fragment key={__i43}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6', fontSize: '13px', flexWrap: 'wrap'}}><span style={{color: '#6B625B'}}>{kv.k}</span><span style={{fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>{kv.v}</span></div>
                  </React.Fragment>))}
                </div>
                {(entry.hasDecision) ? (<>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px', flexWrap: 'wrap'}}>
                    <span style={{color: '#3D3733'}}>Produced by: {entry.decisionLabel}</span>
                    <button onClick={entry.openDecision} style={{border: 'none', background: 'transparent', padding: '0', minHeight: '44px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', textDecoration: 'underline', textDecorationColor: '#948779', textUnderlineOffset: '3px'}}>See reasoning</button>
                  </div>
                </>) : null}
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '12px', fontWeight: '600', color: '#3D3733'}}>Beancount entry</span>
                    <button onClick={copyBean} style={{height: '36px', padding: '0 10px', border: '1px solid #E8E1D8', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', color: '#0A0908'}} className="dc-h6"><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3'></path></svg>Copy</button>
                  </div>
                  <pre style={{margin: '0', background: '#FAF7F2', border: '1px solid #E8E1D8', borderRadius: '8px', padding: '12px', fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px', lineHeight: '1.6', color: '#3D3733', whiteSpace: 'pre', overflowX: 'auto'}}>{entry.bean}</pre>
                  <span style={{fontSize: '12px', color: '#6B625B', fontFamily: '\'JetBrains Mono\',monospace', overflowWrap: 'anywhere'}}>File hash after write: {entry.hash}</span>
                </div>
              </div>
            </>) : null}

            {(sh.switcherSettings) ? (<>
              <button onClick={openSettingsFromSheet} style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} className="dc-h6"><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true'><path d='M3 4.5h10M3 8h10M3 11.5h10M6 3v3M10.5 6.5v3M5 10v3'></path></svg>Stokvel settings</button>
            </>) : null}

            {(sh.calc) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.6'}}>I start from what's in the pool and take out everything your members are owed or protected by. What's left can go out without delaying the {lend.payout} payout.</p>
                <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '8px', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6'}}><span style={{color: '#3D3733'}}>Pool balance</span><span>{lend.pool}</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6'}}><span style={{color: '#3D3733'}}>Reserve floor, never lent</span><span>−{lend.reserve}</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6'}}><span style={{color: '#3D3733'}}>{lend.oblLabel}</span><span>−{lend.obl}</span></div>
                  {(lend.hasLoaned) ? (<><div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', borderBottom: '1px solid #F2EDE6'}}><span style={{color: '#3D3733'}}>{lend.loanedText}</span><span></span></div></>) : null}
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', fontWeight: '600'}}><span>Money you can lend safely</span><span>{lend.lendable}</span></div>
                </div>
                <p style={{margin: '0', fontSize: '13px', lineHeight: '1.55', color: '#3D3733'}}>I also only lend to stokvels that repay before your payout. {lend.outNote}</p>
              </div>
            </>) : null}

            {(sh.approve) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '8px', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #E8E1D8'}}><span style={{color: '#3D3733'}}>Money you can lend now</span><span>{loan.now}</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #E8E1D8'}}><span style={{color: '#3D3733'}}>After this loan</span><span style={{fontWeight: '600'}}>{loan.after}</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px'}}><span style={{color: '#3D3733'}}>Reserve floor</span><span>{lend.reserve} · untouched</span></div>
                </div>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.55'}}>After this loan, your lendable surplus will be {loan.after}. {loan.repayLine}</p>
                {(approveConfirm) ? (<>
                  <button onClick={startApprove} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Confirm and fund escrow</button>
                </>) : null}
                {(approveFailed) ? (<>
                  <div role='alert' style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <div style={{background: '#F7E5E1', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '12px', fontSize: '13px', lineHeight: '1.5'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='#9C3A27' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none', marginTop: '1px'}}><path d='M8 2.5l6 11H2zM8 7v2.5M8 11.5v.01'></path></svg><span><b style={{fontWeight: '600'}}>The escrow wasn't funded.</b> {approveErrorText}</span></div>
                    <button onClick={startApprove} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Try again</button>
                    <button onClick={closeApprove} style={{height: '44px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#3D3733', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h12">Come back later</button>
                  </div>
                </>) : null}
                {(approveBusy) ? (<>
                  <div role='status' aria-live='polite' style={{display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span>{settleLabel}</span>{(settled) ? (<><span style={{color: '#1F5C45', display: 'flex', alignItems: 'center', gap: '4px'}}><svg width='12' height='12' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M3.5 8.5l3 3 6-7'></path></svg>Escrow funded</span></>) : null}</div>
                    <div style={{height: '4px', borderRadius: '999px', background: '#E8E1D8', overflow: 'hidden'}}><div style={{height: '100%', background: '#0A0908', transition: 'width 1600ms cubic-bezier(0.2,0,0,1)', width: settlePct}}></div></div>
                  </div>
                </>) : null}
              </div>
            </>) : null}

            {(sh.decline) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>They'll see your reason. A clear one helps them come back with a request you can accept.</p>
                <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Reason</span>
                  <select value={declineReason} onChange={setDeclineReason} style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', padding: '0 12px', fontSize: '15px', color: '#0A0908', fontFamily: 'inherit'}}>
                    <option value=''>Choose a reason</option>
                    {(declineReasons).map((dr, __i44) => (<React.Fragment key={__i44}><option value={dr}>{dr}</option></React.Fragment>))}
                  </select>
                </label>
                {(declineOther) ? (<>
                  <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>In your words</span><textarea value={declineNote} onChange={setDeclineNote} rows='3' style={{borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', padding: '12px 16px', fontSize: '15px', color: '#0A0908', fontFamily: 'inherit', resize: 'vertical', outline: 'none'}} className="dc-f4"></textarea></label>
                </>) : null}
                <button onClick={confirmDecline} disabled={declineDisabled} style={{height: '48px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer', background: declineBtnBg, color: declineBtnFg}}>Decline request</button>
              </div>
            </>) : null}

            {(sh.editAmt) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <label style={{display: 'flex', flexDirection: 'column', gap: '8px'}}><span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Monthly contribution</span><span style={{height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', boxSizing: 'border-box'}}><span style={{color: '#6B625B', fontSize: '15px'}}>R</span><input inputMode='numeric' value={editAmt} onChange={setEditAmt} style={{flex: '1', minWidth: '0', border: 'none', outline: 'none', fontSize: '15px', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: '#0A0908'}} /></span></label>
                <p style={{margin: '0', fontSize: '13px', lineHeight: '1.55', color: '#3D3733'}}>DebiCheck needs the member to approve a new amount with their bank, so their mandate shows Pending until they do. The change is logged to the ledger.</p>
                <button onClick={saveEditAmt} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#9E5A22', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h3">Save and send for approval</button>
              </div>
            </>) : null}

            {(sh.remove) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.6'}}>{removeText}</p>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733', fontVariantNumeric: 'tabular-nums'}}>{reserveText}</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <button onClick={confirmRemove} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#B5452F', color: '#FFFFFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h13">Remove member</button>
                  <button onClick={closeSheet} style={{height: '44px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#3D3733', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h12">Keep them</button>
                </div>
              </div>
            </>) : null}

            {(sh.notifs) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #E8E1D8', borderRadius: '12px', overflow: 'hidden'}}>
                  {(notifList).map((n, __i45) => (<React.Fragment key={__i45}>
                    <button onClick={n.on} style={{display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', minHeight: '64px', border: 'none', borderBottom: '1px solid #F2EDE6', background: '#FFFFFF', textAlign: 'left', cursor: 'pointer', color: '#0A0908', width: '100%'}} className="dc-h6">
                      <span style={{width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: n.bg, color: n.fg}}><svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d={n.icon}></path></svg></span>
                      <span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.45'}}>{n.text}</span><span style={{fontSize: '12px', color: '#6B625B'}}>{n.time} · also sent on WhatsApp</span></span>
                      <span aria-hidden='true' style={{width: '8px', height: '8px', borderRadius: '999px', flex: 'none', marginTop: '6px', background: n.dotBg}}></span>
                    </button>
                  </React.Fragment>))}
                </div>
                <button onClick={markRead} style={{height: '44px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}} className="dc-h6">Mark all as read</button>
              </div>
            </>) : null}

            {(sh.lfilter) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Date range</span>
                  <div role='radiogroup' style={{display: 'flex', padding: '4px', background: '#E8E1D8', borderRadius: '8px', gap: '4px'}}>
                    {(lfRanges).map((o, __i46) => (<React.Fragment key={__i46}><button role='radio' aria-checked={o.sel} onClick={o.on} style={{flex: '1', height: '40px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: o.bg, color: o.fg, boxShadow: o.sh}}>{o.label}</button></React.Fragment>))}
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', fontWeight: '500', color: '#3D3733'}}>Entry type</span>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {(lfTypes).map((t, __i47) => (<React.Fragment key={__i47}><button onClick={t.toggle} aria-pressed={t.on} style={{height: '44px', padding: '0 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: t.bg, color: t.fg, border: `1px solid ${t.bd}`}}>{t.label}</button></React.Fragment>))}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={clearLedgerFilter} style={{flex: '1', height: '48px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', color: '#0A0908', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}}>Clear</button>
                  <button onClick={closeSheet} style={{flex: '2', height: '48px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}}>{lfShowLabel}</button>
                </div>
              </div>
            </>) : null}

            {(sh.arange) ? (<>
              <div role='radiogroup' style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {(arOpts).map((o, __i48) => (<React.Fragment key={__i48}>
                  <button role='radio' aria-checked={o.sel} onClick={o.on} style={{textAlign: 'left', minHeight: '52px', padding: '0 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', color: '#0A0908', fontSize: '15px', background: o.bg, border: `1.5px solid ${o.bd}`}}><span style={{width: '20px', height: '20px', borderRadius: '999px', flex: 'none', boxSizing: 'border-box', background: '#FFFFFF', border: o.radioBd}}></span>{o.label}</button>
                </React.Fragment>))}
              </div>
            </>) : null}

            {(sh.join) ? (<>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <p style={{margin: '0', fontSize: '15px', lineHeight: '1.6'}}>Your treasurer sends you an invitation by SMS. Open the link on this phone and you'll be asked to approve a DebiCheck debit order with your bank.</p>
                <p style={{margin: '0', fontSize: '14px', lineHeight: '1.55', color: '#3D3733'}}>Haven't received it? Ask your treasurer to resend it from their Members screen.</p>
                <button onClick={closeSheet} style={{height: '48px', borderRadius: '8px', border: 'none', background: '#0A0908', color: '#FAF7F2', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}}>Done</button>
              </div>
            </>) : null}
          </div>
        </div>
      </div>
    </>) : null}

    {(nfOn) ? (<>
      <div role='status' aria-live='polite' style={{position: 'absolute', left: '12px', right: '12px', zIndex: '25', display: 'flex', justifyContent: 'center', top: L.nfTop}}>
        <div style={{width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px 10px 12px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(10,9,8,0.06),0 8px 24px rgba(10,9,8,0.06)', animation: 'bt-down 400ms cubic-bezier(0.2,0,0,1)', background: nf.bg, border: `1px solid ${nf.bd}`}}>
          <span style={{width: '32px', height: '32px', borderRadius: '999px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: nf.ic}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M2.5 13.5l.9-2.7A5.5 5.5 0 1 1 5.6 13z'></path></svg></span>
          <span style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px'}}><span style={{fontSize: '14px', lineHeight: '1.4', color: '#0A0908'}}>{nf.text}</span><span style={{fontSize: '12px', color: '#3D3733'}}>{nf.sub}</span></span>
          <button onClick={nfAction} style={{height: '36px', padding: '0 12px', borderRadius: '8px', border: '1px solid #948779', background: '#FFFFFF', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#0A0908', flex: 'none'}}>{nf.action}</button>
          <button onClick={nfDismiss} aria-label='Dismiss' style={{width: '44px', height: '44px', border: 'none', background: 'transparent', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3733', flex: 'none'}}><svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' aria-hidden='true'><path d='M4 4l8 8M12 4l-8 8'></path></svg></button>
        </div>
      </div>
    </>) : null}

    {(toastOn) ? (<>
      <div role='status' aria-live='polite' style={{position: 'absolute', left: '16px', right: '16px', zIndex: '30', display: 'flex', justifyContent: 'center', pointerEvents: 'none', bottom: L.toastBottom}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#0A0908', color: '#FAF7F2', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', lineHeight: '1.4', boxShadow: '0 1px 2px rgba(10,9,8,0.06),0 8px 24px rgba(10,9,8,0.06)', animation: 'bt-up 250ms cubic-bezier(0.2,0,0,1)', maxWidth: '420px'}}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' style={{flex: 'none'}}><path d='M3.5 8.5l3 3 6-7'></path></svg>{toastText}
        </div>
      </div>
    </>) : null}
  </div>
  </div>
</div>
</>);
}
