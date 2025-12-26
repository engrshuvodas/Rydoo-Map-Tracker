
import React from 'react';
import { DocSection } from '../types';

interface DocumentationViewProps {
  section: DocSection;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ section }) => {
  const renderCodeBlock = (title: string, code: string) => (
    <div className="space-y-2 mb-8">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
        <span>{title}</span>
      </div>
      <pre className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-white/5">
        <code>{code}</code>
      </pre>
    </div>
  );

  const renderMapsLogic = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Real Google Maps Integration</h2>
      <p className="text-slate-400 text-sm">On real devices, Rydoo utilizes the native Google Maps SDK. Here is the core implementation for tracking the group.</p>
      
      {renderCodeBlock("lib/widgets/ride_map.dart", `
class RideMap extends StatefulWidget {
  @override
  _RideMapState createState() => _RideMapState();
}

class _RideMapState extends State<RideMap> {
  GoogleMapController? _controller;
  
  // Real-time markers from Firebase Stream
  Set<Marker> _buildMarkers(List<Rider> riders) {
    return riders.map((rider) => Marker(
      markerId: MarkerId(rider.id),
      position: LatLng(rider.lat, rider.lng),
      icon: BitmapDescriptor.defaultMarkerWithHue(
        rider.isLeader ? BitmapDescriptor.hueAzure : BitmapDescriptor.hueRed
      ),
      infoWindow: InfoWindow(title: rider.name),
    )).toSet();
  }

  @override
  Widget build(BuildContext context) {
    final rideState = Provider.of<RideProvider>(context);
    
    return GoogleMap(
      initialCameraPosition: CameraPosition(target: LatLng(0,0), zoom: 15),
      onMapCreated: (c) => _controller = c,
      markers: _buildMarkers(rideState.members),
      myLocationEnabled: true,
      myLocationButtonEnabled: false,
      zoomControlsEnabled: false,
    );
  }
}`)}
    </div>
  );

  const renderRoleLogic = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Role Management Logic</h2>
      <p className="text-slate-400 text-sm">How we handle "Leader Approval" across the network using Firestore Transactions.</p>
      
      {renderCodeBlock("lib/services/ride_service.dart", `
Future<void> suggestDestination(String rideId, Destination dest) async {
  final rideRef = _db.collection('rides').doc(rideId);
  
  // If user is leader, update immediately. 
  // If member, add to 'suggestions' list for leader to approve.
  if (currentUser.isLeader) {
    await rideRef.update({'destination': dest.toMap()});
  } else {
    await rideRef.collection('suggestions').add({
      'proposedBy': currentUser.uid,
      'destination': dest.toMap(),
      'status': 'pending'
    });
  }
}`)}
    </div>
  );

  switch (section) {
    case DocSection.IOS_SWIFT: return renderMapsLogic();
    case DocSection.ANDROID_KOTLIN: return renderRoleLogic();
    case DocSection.FIREBASE_SCHEMA:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Data Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-indigo-400 mb-2">Location Stream</h4>
              <p className="text-[11px] text-slate-300 italic">"The heartbeat of the app. Every 2 seconds, we push the current LatLng to Firestore."</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-emerald-400 mb-2">Diff Listener</h4>
              <p className="text-[11px] text-slate-300 italic">"Clients listen to specific documents. We only redraw markers when the LatLng changes > 5 meters."</p>
            </div>
          </div>
        </div>
      );
    default:
      return <div className="p-12 text-center text-slate-300 italic">Select a section to view technical details.</div>;
  }
};

export default DocumentationView;
