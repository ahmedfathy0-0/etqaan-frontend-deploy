interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  rank?: number;
}

interface MyBatchesListProps {
  batches: Batch[];
}

export default function MyBatchesList({ batches }: MyBatchesListProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
      <h2 className="text-xl font-bold text-gray-800 font-arabic mb-4 flex items-center gap-2">
        <span>📚</span>
        حلقاتي
      </h2>

      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="border-2 border-blue-100 rounded-xl p-4 bg-blue-50/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 font-arabic text-lg">
                  {batch.name}
                </h3>
                <p className="text-gray-500 font-arabic text-sm">
                  {batch.schedule_description}
                </p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🥉</span>
                <p className="text-sm font-arabic text-gray-600">
                  المركز {batch.rank}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
