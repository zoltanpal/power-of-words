import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant
} from 'reactflow';
import type { Connection } from 'reactflow';
import 'reactflow/dist/style.css';


const initialNodes = [
  { id: '1', data: { label: 'Internet'}, position: { x: 85, y: 0 }, type: 'input' },
  { id: '2', data: { label: 'NGINX' }, position: { x: 85, y: 70 } },
  { id: '3', data: { label: 'React App\n(Tailwind + Shadcn + HighchartsJS)' }, position: { x: 0, y: 140 } },
  { id: '4', data: { label: 'Golang API' }, position: { x: 170, y: 140 } },

  { id: '5', data: { label: 'Cronjobs\n(Python & Golang)' }, position: { x: 333, y: 40 } },
  { id: '6', data: { label: 'Python libs\n(LLM, SQLAlchemy, etc.)' }, position: { x: 500, y: 120 } },
  { id: '7', data: { label: 'PostgreSQL' }, position: { x: 333, y: 210 } },
  
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e4-3', source: '4', target: '3', animated: true, style: { stroke: 'blue' } },
  { id: 'e7-4', source: '7', target: '4', animated: true, style: { stroke: 'blue' } },
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: 'green' } },
  { id: 'e5-6', source: '5', target: '6' },

];

export default function ArchitectureReactFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="h-[600px] w-full border rounded">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
