// Tooltip content for File Manager
export const TOOLTIPS = {
  // Admin Stamp Creation
  ADMIN_PREVIOUSLY_CREATED: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">Use Existing Admin Drive</div>
An existing Admin Drive from a previous session can be selected here. This will link the File Manager to that Admin Drive.
<br/>
<br/>
Otherwise, leave this blank and configure a new Admin Drive below.`,
  ADMIN_DESIRED_LIFETIME: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">What is Desired Lifetime?</div>
To create the Admin Drive, a one-time deposit is required to pay for its storage on the network.
<br/>
<br/>
This sets the initial period the Admin Drive's information will be paid for on the network. This is not a fixed expiry date. It's the estimated time it will take for the drive's balance to be depleted. You can top up any time to extend the lifetime.
<br/>
<br/>
<b>Warning:</b> The Admin Drive is critical for managing files. If its deposit runs out and it is not renewed, the network will no longer store its data, and access to the File Manager instance will be permanently lost.`,

  ADMIN_SECURITY_LEVEL: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">What is Security Level?</div>
This controls how many redundant copies of the Admin Drive's core information are created and spread across the network.
<br/>
<br/>
A higher level provides extra protection against data loss in the improbable event of large-scale network disruptions.
<br/>
<br/>
<b>Trade-off:</b> Higher redundancy levels decrease your initial storage, while keeping the initial deposit cost the same for the same Desired Lifetime.`,

  ADMIN_ESTIMATED_COST: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">How is this cost calculated?</div>
This is the one-time deposit of xBZZ tokens required to create the Admin Drive.
<br/>
<br/>
It is calculated based on two factors:<br/>
1. <b>Desired Lifetime:</b> The desired storage duration.<br/>
2. <b>Current Network Price:</b> The cost of storage at this moment.
<br/>
<br/>
This deposit is used to pay storage fees on the network over time. The cost is not a one-time purchase but a deposit that will be gradually consumed over time based on the network's storage fees.
<br/>
<br/>
As the deposit depletes, the Admin Drive's lifetime decreases. You can top up the deposit at any time to extend its lifetime.
<br/>
<br/>
<b>Note:</b> This estimate is based on current network conditions and the deposit's depletion rate is subject to change and is contingent upon prevailing market conditions.`,

  ADMIN_PURCHASE_BUTTON: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">Create Admin Drive</div>
This action will do two things:
<br/>
<br/>
1. It will make a one-time transaction to deposit the Estimated Cost.<br/>
2. It will create the Admin Drive.`,

  ADMIN_PURCHASE_BUTTON_ALREADY_EXISTED_ADMIN_DRIVE: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">Create Admin Drive</div>

It will create the Admin Drive.`,

  // Drive Creation
  DRIVE_NAME: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">About Drive Name</div>
Set a human-readable label for this drive (e.g. Personal files). This name is stored as metadata.`,

  DRIVE_INITIAL_CAPACITY: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">What is Initial Storage?</div>
This sets the initial storage capacity. This value is used in combination with lifetime and redundancy, to calculate the initial deposit.
<br/>
<br/>
<b>Warning:</b> Be aware that in rare cases the drive might indicate it's full sooner than expected.
<br/>
<br/>
<b>Tip:</b> Selecting a size with a little extra room provides the best flexibility.`,

  DRIVE_DESIRED_LIFETIME: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">What is Desired Lifetime?</div>
This sets the initial period the drive's information will be paid for on the network. This is not a fixed expiry date. It's the estimated time it will take for the drive's balance to be depleted. You can top up any time to extend the lifetime.
<br/>
<br/>
<b>Warning:</b> If the deposit balance runs out, the drive's data is no longer paid for and will be scheduled for permanent deletion by the network. The rate of depletion is depends upon actual market conditions.`,

  DRIVE_SECURITY_LEVEL: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">What is Security Level?</div>
This controls the level of data redundancy for your drive's data.
<br/>
<br/>
Higher levels provide maximum protection against data loss, even in the unlikely event of large-scale network disruptions.
<br/>
<br/>
<b>Trade-off:</b> Higher redundancy levels decreases your initial storage, while keeping the initial deposit cost the same for the same Desired Lifetime.`,

  DRIVE_ESTIMATED_COST: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">How is this cost calculated?</div>
This is the one-time deposit of xBZZ tokens required to fund the drive's storage.
<br/>
<br/>
It is calculated based on:
<br/>
1. <b>Initial Storage</b> (Storage size)
<br/>
2. <b>Desired Lifetime</b> (Persistence duration)<br/>
3. <b>Current Network Price</b> (Dynamic storage costs)
<br/>
<br/>
This deposit is used to pay storage fees on the network over time. The cost is not a one-time purchase but a deposit that will be gradually consumed over time based on the network's storage fees.
<br/>
<br/>
As the deposit depletes, the drive's lifetime decreases. You can top up the deposit at any time to extend its lifetime.
<br/>
<br/>
<b>Note:</b> This estimate is based on current network conditions and the deposit's depletion rate is subject to change and is contingent upon prevailing market conditions.`,

  PRIVATE_KEY_MODAL_HEADER: `The Private Key ensures exclusive access to this File Manager instance. It is the user's responsibity to store in a secure and tamper-proof way.`,
  PRIVATE_KEY_MODAL_GENERATED_KEY: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">Generated Key</div>
A unique, 64-character secure key has been generated.
<br/>
<br/>
Advanced users can delete this and input a custom key.`,
  PRIVATE_KEY_MODAL_CONFIRM_KEY: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">Confirmation Step</div>
This is a final safety check to ensure a copy of the key has been saved before proceeding.`,
  PRIVATE_KEY_MODAL_KEY_INFO: `<div style="font-weight: bold; margin-bottom: 12px; font-size: 14px;">On This Device Only</div>
For convenience, an encrypted copy of this key is saved in this browser's local storage. This avoids needing to enter it on every visit.`,
}
