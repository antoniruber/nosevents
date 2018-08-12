from boa.interop.Neo.Storage import GetContext, Put, Delete, Get
from boa.builtins import range
from boa.interop.Neo.Runtime import CheckWitness, Serialize, Deserialize, Log

def get_userInvites(wallet_id):
    serial = Get(GetContext(), wallet_id)
    if serial:
        invites = Deserialize(serial)
        return invites
    return []
    
def add_userInvite(wallet_id, invite_id):
    invites = get_userInvites(wallet_id)
    invites.append(invite_id)
    serial = Serialize(invites)
    Put(GetContext(), wallet_id, serial)

def remove_userInvite(wallet_id, invite_id):
    invites = get_userInvites(wallet_id)
    for i in range(0, len(invites)):
        if invite_id == invites[i]:
            invites.remove(i)
            serial = Serialize(invites)
            Put(GetContext(), wallet_id, serial)
            return True
    return False


# Main Operation
#
def Main(operation, args):
    """
    Main definition for the smart contracts

    :param operation: the operation to be performed
    :type operation: str

    :param args: list of arguments.
        args[0] is always sender script hash
        args[1] is always invite_id
        args[2] is a text
        args[3] is a date
        args[4] is a guests[]

    :return:
        byterarray: The result of the operation
    """

    # Am I who I say I am?
    user_hash = args[0]
    authorized = CheckWitness(user_hash)
    if not authorized:
        Log("[!] Not Authorized")
        return False
    Log("[+] Authorized")

    if operation == "CreateInvite":
        if len(args) < 6:
            Log("[!] Incorrect number of arguments!")
            return False
        invite_id = args[1]
        text = args[2]
        date = args[3]
        location = args[4]
        # creator of the event always attends
        invitees = []
        tmp_user = [user_hash, "accepted"]
        invitees.append(tmp_user)
        for i in range(5, len(args)):
            user = [args[i], "invited"]
            invitees.append(user)

    elif operation == "GetMyInvites":
        if len(args) != 1:
            Log("[!] Incorrect number of arguments!")
            return False
            
    else:
        if len(args) != 2:
            Log("[!] Incorrect number of arguments!")
            return False
        invite_id = args[1]

    context = GetContext()
    
    # Act based on requested operation
    if operation == "CreateInvite":
        Log("[*] CreateInvite")
        
        invite_exists = Get(context, invite_id)
        if invite_exists:
            Log("[!] Invite already exists")
        else:
            Log("[!] Creating invite")
           #invite = {
           #    "id": invite_id,
           #    "owner": user_hash,
           #    "text": text,
           #    "date": date,
           #    "location": location,
           #    "guests": invitees }
            invite = [invite_id, user_hash, text, date, location, invitees]
            serial = Serialize(invite)
            Put(context, invite_id, serial)

            Log("[!] Adding invites to users")
            for i in range(0, len(invitees)):
                wallet_id = invitees[i][0]
                add_userInvite(wallet_id, invite_id)
            Log("[!] Done adding invites to users")
                
            Log("[+] Invite Created!")
            return True

        return False

    elif operation == "GetMyInvites":
        Log("[*] GetMyInvites")
        invites_serial = Get(context, user_hash)
        if invites_serial:
            invites = Deserialize(invites_serial)
            return invites
        else:
            Log("[!] No invites found!")
            return False

    elif operation == "Accept":
        Log("[*] Accept")
        invite_serial = Get(context, invite_id)
        if invite_serial:
            invite = Deserialize(invite_serial)
            place = -1
            for i in range(0, len(invite[5])):
                if user_hash is invite[5][i][0]:
                    place = i

            if place != -1:
                invite[5][place][1] = "accepted"
                serial = Serialize(invite)
                Put(context, invite_id, serial)
                return True
            else:
                Log("[!] Can't accept if you're not invited!")
                return False
        else:
            Log("[!] Invite ID doesn't exist!")
            return False
            
    elif operation == "Decline":
        Log("[*] Decline")
        invite_serial = Get(context, invite_id)
        if invite_serial:
            invite = Deserialize(invite_serial)
            place = -1
            for i in range(0, len(invite[5])):
                if user_hash is invite[5][i][0]:
                    place = i

            if place != -1:
                invite[5][place][1] = "declined"
                serial = Serialize(invite)
                Put(context, invite_id, serial)
                return True
            else:
                Log("[!] Can't decline if you're not invited!")
                return False
        else:
            Log("[!] Invite ID doesn't exist!")
            return False
            
    elif operation == "RemoveInvite":
        Log("[*] RemoveInvite")
        serial = Get(context, invite_id)
        if serial:
            invite = Deserialize(serial)
            if invite[1] is user_hash:
                # Delete the invite
                Delete(context, invite_id)
                Log("[+] Invite removed")
                Log("[!] Removing invites from users")
                for i in range(0, len(invite[5])):
                    wallet_id = invite[5][i][0]
                    remove_userInvite(wallet_id, invite[0])
                Log("[!] Done removing invites from users")
                return True
            else:
                Log("[!] You are not the owner of the invite!")
                return False
        else:
            Log("[!] Invite ID not found!")
            return False
            
    else:
        Log("[!] Invite ID not found!")

    return False
