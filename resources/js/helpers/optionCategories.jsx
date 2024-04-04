import ChairIcon from '@mui/icons-material/Chair';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LuggageIcon from '@mui/icons-material/Luggage';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WifiIcon from '@mui/icons-material/Wifi';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarIcon from '@mui/icons-material/Star';
import PrintIcon from '@mui/icons-material/Print';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ShowerIcon from '@mui/icons-material/Shower';

const optionCategories = {
    lounge: {
        icon: () => { return <ChairIcon /> }
    },
    escort: {
        icon: () => { return <EscalatorWarningIcon /> }
    },
    "food-and-water": {
        icon: () => { return <RestaurantIcon /> }
    },
    luggage: {
        icon: () => { return <LuggageIcon /> }
    },
    transfer: {
        icon: () => { return <DriveEtaIcon /> }
    },
    parking: {
        icon: () => { return <LocalParkingIcon /> }
    },
    children: {
        icon: () => { return <ChildCareIcon /> }
    },
    "the-internet-and-tv": {
        icon: () => { return <WifiIcon /> }
    },
    press: {
        icon: () => { return <NewspaperIcon /> }
    },
    comfort: {
        icon: () => { return <StarIcon /> }
    },
    "office-equipment": {
        icon: () => { return <PrintIcon /> }
    },
    "meeting-room": {
        icon: () => { return <MeetingRoomIcon /> }
    },
    "tax-free": {
        icon: () => { return <ShoppingBagIcon /> }
    },
    "inspection-and-control": {
        icon: () => { return <AirplaneTicketIcon /> }
    },
    "alcohol": {
        icon: () => { return <LocalBarIcon /> }
    },
    "shower": {
        icon: () => { return <ShowerIcon /> }
    }
};
export default optionCategories;